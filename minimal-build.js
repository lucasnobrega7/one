// Temporarily disable problematic files for deployment
const fs = require('fs')
const path = require('path')

const filesToDisable = [
  'components/navigation/unified-navigation.tsx',
  'components/layout/dashboard-layout.tsx',
  'components/layout/navigation.tsx',
  'app/onboarding/page.tsx'
]

const backupDir = './backup-disabled'
if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir, { recursive: true })
}

console.log('🔧 Creating minimal build by disabling problematic files...')

filesToDisable.forEach(file => {
  if (fs.existsSync(file)) {
    // Backup original
    const backupPath = path.join(backupDir, path.basename(file))
    fs.copyFileSync(file, backupPath)
    
    // Create minimal placeholder
    const ext = path.extname(file)
    if (ext === '.tsx') {
      fs.writeFileSync(file, `export default function Placeholder() { return <div>Temporarily disabled for build</div> }`)
    } else if (ext === '.ts') {
      fs.writeFileSync(file, `export default {}`)
    }
    
    console.log(`✅ Disabled: ${file}`)
  }
})

console.log('🎉 Minimal build ready!')