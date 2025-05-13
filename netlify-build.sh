#!/bin/bash
echo "Building a STATIC ONLY version for Netlify..."

# Create public directory if it doesn't exist
mkdir -p public

# Create basic static pages directly in the public directory
cat > public/index.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Food Ordering System</title>
  <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
  <style>
    .banner {
      background-color: #f8d7da;
      color: #721c24;
      padding: 10px;
      margin-bottom: 20px;
      border-radius: 5px;
      text-align: center;
    }
  </style>
</head>
<body class="bg-gray-100">
  <div class="min-h-screen flex flex-col items-center justify-center p-4">
    <div class="banner">
      This is a static landing page only. The full application requires a server with database support.
    </div>
    <div class="bg-white rounded-lg shadow-xl p-8 max-w-2xl w-full">
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold mb-4">Food Ordering System</h1>
        <p class="text-xl text-gray-600">Delicious food delivered to your door</p>
      </div>
      
      <div class="mb-8">
        <h2 class="text-2xl font-semibold mb-4">About This Project</h2>
        <p class="text-gray-700 mb-4">
          This is a full-stack food ordering application that allows users to browse restaurants, 
          add items to cart, and place orders for delivery or pickup.
        </p>
        <p class="text-gray-700">
          Built with Next.js, TypeScript, Prisma, TailwindCSS, and NextAuth.js.
        </p>
      </div>
      
      <div class="mb-8">
        <h2 class="text-2xl font-semibold mb-4">Key Features</h2>
        <ul class="list-disc pl-5 text-gray-700 space-y-2">
          <li>Browse restaurants and menus</li>
          <li>Add items to cart</li>
          <li>Complete checkout process</li>
          <li>Track order status</li>
          <li>User authentication</li>
        </ul>
      </div>
      
      <div class="text-center">
        <a href="https://github.com/Mkaify/Online-Food-Ordering-System" 
           class="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors inline-block">
          View on GitHub
        </a>
      </div>
    </div>
    
    <footer class="mt-8 text-center text-gray-500 text-sm">
      © 2023 Food Ordering System. All rights reserved.
    </footer>
  </div>
</body>
</html>
EOF

# Create a _redirects file for Netlify
cat > public/_redirects << 'EOF'
# Netlify redirects file
# Redirect all paths to index.html for client-side routing
/*    /index.html   200
EOF

# Create a README.md file
cat > public/README.md << 'EOF'
# Food Ordering System (Netlify Deployment)

This is a static version of the Food Ordering System deployed on Netlify.

## About This Project

The Food Ordering System is a full-stack application built with:

- Next.js
- TypeScript
- Prisma
- TailwindCSS
- NextAuth.js

## Features

- Browse restaurants and menus
- Add items to cart
- Complete checkout process
- Track order status
- User authentication

## Links

- [GitHub Repository](https://github.com/Mkaify/Online-Food-Ordering-System)
- [Full Documentation](https://github.com/Mkaify/Online-Food-Ordering-System/blob/main/README.md)

## Deployment

This static version is deployed on Netlify.
EOF

# Create a placeholder file to indicate this is not a Next.js build
cat > public/NO_NEXTJS_BUILD.txt << 'EOF'
This is a static-only site deployment. No Next.js build output should be expected here.
Please disable the Next.js plugin in the Netlify UI if it's enabled.
EOF

# Exit with success
echo "Static build completed successfully!"
echo "IMPORTANT: You need to remove the Next.js plugin from your Netlify site via the UI"
exit 0 