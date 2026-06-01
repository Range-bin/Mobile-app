Add-Type -AssemblyName System.IO.Compression

$icons = @{
    "home.png" = @(153, 153, 153)
    "home-active.png" = @(255, 107, 53)
    "discover.png" = @(153, 153, 153)
    "discover-active.png" = @(255, 107, 53)
    "favorite.png" = @(153, 153, 153)
    "favorite-active.png" = @(255, 107, 53)
    "profile.png" = @(153, 153, 153)
    "profile-active.png" = @(255, 107, 53)
}

function Create-Chunk {
    param([string]$type, [byte[]]$data)
    
    $typeBytes = [System.Text.Encoding]::ASCII.GetBytes($type)
    $length = [BitConverter]::GetBytes([uint32]::Swap($data.Length))
    
    $chunkData = [byte[]]::new($typeBytes.Length + $data.Length)
    [Array]::Copy($typeBytes, $chunkData, $typeBytes.Length)
    [Array]::Copy($data, 0, $chunkData, $typeBytes.Length, $data.Length)
    
    $crc = Update-CRC32 $chunkData
    
    $result = [byte[]]::new(12 + $data.Length)
    [Array]::Copy($length, $result, 4)
    [Array]::Copy($chunkData, 0, $result, 4, $chunkData.Length)
    [Array]::Copy([BitConverter]::GetBytes([uint32]::Swap($crc)), 0, $result, $result.Length - 4, 4)
    
    return $result
}

function Update-CRC32 {
    param([byte[]]$buf)
    
    $crcTable = [uint32[]]::new(256)
    for ($i = 0; $i -lt 256; $i++) {
        $c = $i
        for ($j = 0; $j -lt 8; $j++) {
            if ($c -band 1) {
                $c = 0xEDB88320 -bxor ($c -shr 1)
            } else {
                $c = $c -shr 1
            }
        }
        $crcTable[$i] = $c
    }
    
    $crc = 0xFFFFFFFF
    foreach ($byte in $buf) {
        $crc = $crcTable[($crc -bxor $byte) -band 0xFF] -bxor ($crc -shr 8)
    }
    
    return ($crc -bxor 0xFFFFFFFF)
}

foreach ($icon in $icons.GetEnumerator()) {
    $filename = $icon.Key
    $color = $icon.Value
    $r = $color[0]
    $g = $color[1]
    $b = $color[2]
    
    $width = 81
    $height = 81
    
    $signature = [byte[]](137, 80, 78, 71, 13, 10, 26, 10)
    
    $ihdrData = [byte[]]::new(13)
    [BitConverter]::GetBytes([uint32]::Swap($width)).CopyTo($ihdrData, 0)
    [BitConverter]::GetBytes([uint32]::Swap($height)).CopyTo($ihdrData, 4)
    $ihdrData[8] = 8
    $ihdrData[9] = 2
    $ihdrData[10] = 0
    $ihdrData[11] = 0
    $ihdrData[12] = 0
    
    $ihdr = Create-Chunk "IHDR" $ihdrData
    
    $rawData = [byte[]]::new($height * (1 + $width * 3))
    $offset = 0
    for ($y = 0; $y -lt $height; $y++) {
        $rawData[$offset++] = 0
        for ($x = 0; $x -lt $width; $x++) {
            $rawData[$offset++] = $r
            $rawData[$offset++] = $g
            $rawData[$offset++] = $b
        }
    }
    
    $msInput = [System.IO.MemoryStream]::new($rawData)
    $msOutput = [System.IO.MemoryStream]::new()
    $compressStream = [System.IO.Compression.DeflateStream]::new($msOutput, [System.IO.Compression.CompressionMode]::Compress)
    $msInput.CopyTo($compressStream)
    $compressStream.Close()
    $compressed = $msOutput.ToArray()
    
    $idat = Create-Chunk "IDAT" $compressed
    
    $iend = Create-Chunk "IEND" ([byte[]]::new(0))
    
    $pngData = [System.IO.MemoryStream]::new()
    $pngData.Write($signature, 0, 8)
    $pngData.Write($ihdr, 0, $ihdr.Length)
    $pngData.Write($idat, 0, $idat.Length)
    $pngData.Write($iend, 0, $iend.Length)
    
    $filePath = Join-Path "images" $filename
    [System.IO.File]::WriteAllBytes($filePath, $pngData.ToArray())
    Write-Host "Created: $filePath"
}

Write-Host "`nAll icons created successfully!"