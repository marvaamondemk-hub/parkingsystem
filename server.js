services:
  - type: web
    name: parking-system-backend
    env: node
    plan: free
    buildCommand: npm install
    startCommand: npm start
    envVars:
      - key: GMAIL_USER
        value: iellowmar@gmail.com
      - key: GMAIL_PASSWORD
        value: rljt uxzi wbtk qqyf
      - key: NODE_ENV
        value: production
