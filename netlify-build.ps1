# PowerShell script for Netlify build
Write-Host "Building a static version for Netlify..."

# Make sure the required directories exist
if (-not (Test-Path -Path "public")) {
    New-Item -Path "public" -ItemType Directory
}

# Create basic static pages
$htmlContent = @'
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Food Ordering System</title>
  <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
</head>
<body class="bg-gray-100">
  <div class="flex items-center justify-center h-screen">
    <div class="text-center">
      <h1 class="text-4xl font-bold mb-6">Food Ordering System</h1>
      <p class="text-xl mb-8">Delicious food delivered to your door</p>
      <div class="mt-8">
        <a href="https://github.com/Mkaify/food-ordering-system" 
           class="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
          View on GitHub
        </a>
      </div>
    </div>
  </div>
</body>
</html>
'@

Set-Content -Path "public/index.html" -Value $htmlContent

# Exit with success
Write-Host "Static build completed successfully!"
exit 0 