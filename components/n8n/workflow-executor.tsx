'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Loader2, Play, CheckCircle, XCircle, Activity, Refresh } from 'lucide-react';

interface WorkflowExecutorProps {
  workflowId?: string;
  title?: string;
  description?: string;
}

interface ExecutionResult {
  success: boolean;
  executionId?: string;
  data?: any;
  error?: string;
}

interface N8nWorkflow {
  id: string;
  name: string;
  active: boolean;
  tags?: string[];
}

export const N8nWorkflowExecutor: React.FC<WorkflowExecutorProps> = ({
  workflowId = '',
  title = 'N8N Workflow Executor',
  description = 'Execute workflows do N8N diretamente da interface'
}) => {
  const [selectedWorkflow, setSelectedWorkflow] = useState(workflowId);
  const [inputData, setInputData] = useState('{}');
  const [isExecuting, setIsExecuting] = useState(false);
  const [isLoadingWorkflows, setIsLoadingWorkflows] = useState(false);
  const [result, setResult] = useState<ExecutionResult | null>(null);
  const [workflows, setWorkflows] = useState<N8nWorkflow[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');

  useEffect(() => {
    checkConnection();
    loadWorkflows();
  }, []);

  const checkConnection = async () => {
    try {
      const response = await fetch('/api/n8n/status?action=health');
      const result = await response.json();
      
      setConnectionStatus(result.success ? 'connected' : 'disconnected');
    } catch (error) {
      setConnectionStatus('disconnected');
    }
  };

  const loadWorkflows = async () => {
    setIsLoadingWorkflows(true);
    try {
      const response = await fetch('/api/n8n/status?action=workflows');
      const result = await response.json();
      
      if (result.success && result.data) {
        setWorkflows(result.data);
      }
    } catch (error) {
      console.error('Error loading workflows:', error);
    } finally {
      setIsLoadingWorkflows(false);
    }
  };

  const executeWorkflow = async () => {
    if (!selectedWorkflow) {
      setResult({
        success: false,
        error: 'Selecione um workflow para executar'
      });
      return;
    }

    setIsExecuting(true);
    setResult(null);

    try {
      let parsedData = {};
      
      try {
        parsedData = JSON.parse(inputData);
      } catch (e) {
        throw new Error('JSON inválido nos dados de entrada');
      }

      const response = await fetch('/api/n8n/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          workflowId: selectedWorkflow,
          data: parsedData
        })
      });

      const result = await response.json();

      if (response.ok) {
        setResult({
          success: true,
          executionId: result.executionId,
          data: result.data
        });
      } else {
        setResult({
          success: false,
          error: result.error || 'Erro desconhecido'
        });
      }
    } catch (error) {
      setResult({
        success: false,
        error: error instanceof Error ? error.message : 'Erro na execução'
      });
    } finally {
      setIsExecuting(false);
    }
  };

  const formatJsonData = () => {
    try {
      const parsed = JSON.parse(inputData);
      setInputData(JSON.stringify(parsed, null, 2));
    } catch (e) {
      // JSON inválido, manter como está
    }
  };

  const getConnectionStatusColor = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'disconnected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  const getConnectionStatusText = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'Conectado';
      case 'disconnected':
        return 'Desconectado';
      default:
        return 'Verificando...';
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              {title}
            </CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={getConnectionStatusColor()}>
              {getConnectionStatusText()}
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                checkConnection();
                loadWorkflows();
              }}
            >
              <Refresh className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {connectionStatus === 'disconnected' && (
          <Alert className="border-red-200 bg-red-50">
            <XCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              Não foi possível conectar ao N8N. Verifique a configuração da API.
            </AlertDescription>
          </Alert>
        )}

        {/* Seleção de Workflow */}
        <div className="space-y-2">
          <Label htmlFor="workflow-select">Workflow</Label>
          <Select 
            value={selectedWorkflow} 
            onValueChange={setSelectedWorkflow}
            disabled={isLoadingWorkflows || connectionStatus === 'disconnected'}
          >
            <SelectTrigger>
              <SelectValue placeholder={
                isLoadingWorkflows ? 'Carregando workflows...' : 'Selecione um workflow'
              } />
            </SelectTrigger>
            <SelectContent>
              {workflows.map((workflow) => (
                <SelectItem key={workflow.id} value={workflow.id}>
                  <div className="flex items-center gap-2">
                    <span>{workflow.name}</span>
                    {workflow.active && (
                      <Badge variant="outline" className="text-xs">
                        Ativo
                      </Badge>
                    )}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Workflow ID customizado */}
        <div className="space-y-2">
          <Label htmlFor="custom-workflow">Ou insira um Workflow ID customizado</Label>
          <Input
            id="custom-workflow"
            placeholder="workflow-id-customizado"
            value={selectedWorkflow}
            onChange={(e) => setSelectedWorkflow(e.target.value)}
            disabled={connectionStatus === 'disconnected'}
          />
        </div>

        {/* Dados de entrada */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="input-data">Dados de Entrada (JSON)</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={formatJsonData}
              disabled={connectionStatus === 'disconnected'}
            >
              Formatar JSON
            </Button>
          </div>
          <Textarea
            id="input-data"
            placeholder='{"key": "value"}'
            value={inputData}
            onChange={(e) => setInputData(e.target.value)}
            rows={8}
            className="font-mono text-sm"
            disabled={connectionStatus === 'disconnected'}
          />
        </div>

        {/* Botão de execução */}
        <Button
          onClick={executeWorkflow}
          disabled={isExecuting || !selectedWorkflow || connectionStatus === 'disconnected'}
          className="w-full"
        >
          {isExecuting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Executando...
            </>
          ) : (
            <>
              <Play className="mr-2 h-4 w-4" />
              Executar Workflow
            </>
          )}
        </Button>

        {/* Resultado */}
        {result && (
          <div className="space-y-2">
            <Label>Resultado</Label>
            <Alert className={result.success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
              <div className="flex items-start gap-2">
                {result.success ? (
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-600 mt-0.5" />
                )}
                <div className="flex-1">
                  <AlertDescription>
                    {result.success ? (
                      <div className="space-y-2">
                        <p className="text-green-800 font-medium">
                          Workflow executado com sucesso!
                        </p>
                        {result.executionId && (
                          <p className="text-sm text-green-700">
                            ID da Execução: <code className="bg-green-100 px-1 rounded">{result.executionId}</code>
                          </p>
                        )}
                        {result.data && (
                          <pre className="text-sm bg-green-100 p-2 rounded overflow-auto max-h-40">
                            {JSON.stringify(result.data, null, 2)}
                          </pre>
                        )}
                      </div>
                    ) : (
                      <div>
                        <p className="text-red-800 font-medium">Erro na execução:</p>
                        <p className="text-sm text-red-700 mt-1">{result.error}</p>
                      </div>
                    )}
                  </AlertDescription>
                </div>
              </div>
            </Alert>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default N8nWorkflowExecutor;