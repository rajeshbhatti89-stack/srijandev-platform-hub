niwhile ($true) {
    Write-Host "Checking EAS Build status..."
    $json = npx eas-cli build:list --platform android --json --limit 1
    
    try {
        $output = $json | ConvertFrom-Json
        $status = $output[0].status
        
        if ($status -eq "finished") {
            $url = $output[0].artifacts.buildUrl
            Write-Host "Build finished! Downloading APK from $url ..."
            Invoke-WebRequest -Uri $url -OutFile "SrijanDev-Pulse-App.apk"
            Write-Host "✅ APK downloaded successfully to SrijanDev-Pulse-App.apk"
            break
        }
        elseif ($status -eq "errored" -or $status -eq "canceled") {
            Write-Host "❌ Build $status."
            break
        }
        
        Write-Host "Build is currently '$status'. Waiting 60 seconds..."
    }
    catch {
        Write-Host "Failed to parse JSON. Retrying in 60 seconds..."
    }
    
    Start-Sleep -Seconds 60
}
