<#
.SYNOPSIS
  Installe / met à jour / désinstalle les skills flo-code dans %USERPROFILE%\.claude\skills
  (global) ou dans le .claude\skills d'un projet. Réexécuter = mise à jour (écrasement).

.EXAMPLE
  ./install.ps1                         # installe/MAJ TOUS les skills en global
  ./install.ps1 -Project C:\dev\app     # dans <projet>\.claude\skills
  ./install.ps1 -Only flo-nextjs,flo-ui # skills choisis
  ./install.ps1 -List                   # liste les skills installés
  ./install.ps1 -Uninstall              # retire tous les skills flo-code
  ./install.ps1 -Uninstall -Only flo-seo
#>
[CmdletBinding()]
param(
  [string]$Project,
  [string[]]$Only,
  [switch]$Uninstall,
  [switch]$List
)

$ErrorActionPreference = "Stop"
$SrcDir = Join-Path $PSScriptRoot "skills"
$TargetBase = if ($Project) { Join-Path $Project ".claude" } else { Join-Path $HOME ".claude" }
$Dest = Join-Path $TargetBase "skills"

$AllSkills = @("flo-project-audit","flo-dev-standards","flo-debug","flo-medical","flo-nextjs",
               "flo-supabase","flo-offline","flo-seo","frontend-design","flo-ui","design-taste","playwright")
$Selected = if ($Only) { $Only } else { $AllSkills }

function Get-SkillVersion($skillDir) {
  $f = Join-Path $skillDir "SKILL.md"
  if (Test-Path $f) {
    $line = Select-String -Path $f -Pattern '^version:\s*(.+)$' | Select-Object -First 1
    if ($line) { return $line.Matches.Groups[1].Value.Trim() }
  }
  return "?"
}

if ($List) {
  Write-Host "→ Skills installés dans : $Dest"
  if (Test-Path $Dest) {
    $found = $false
    foreach ($s in $AllSkills) {
      $d = Join-Path $Dest $s
      if (Test-Path (Join-Path $d "SKILL.md")) { Write-Host "  ✓ $s (v$(Get-SkillVersion $d))"; $found = $true }
    }
    if (-not $found) { Write-Host "  (aucun)" }
  } else { Write-Host "  (dossier inexistant)" }
  return
}

if ($Uninstall) {
  Write-Host "→ Désinstallation depuis : $Dest"
  foreach ($s in $Selected) {
    $d = Join-Path $Dest $s
    if (Test-Path $d) { Remove-Item -Recurse -Force $d; Write-Host "  ✓ retiré $s" }
  }
  Write-Host "Terminé. Redémarre Claude Code."
  return
}

# install / update
New-Item -ItemType Directory -Force -Path $Dest | Out-Null
Write-Host "→ Installation / mise à jour dans : $Dest"
foreach ($s in $Selected) {
  $src = Join-Path $SrcDir $s
  if (Test-Path $src) {
    $d = Join-Path $Dest $s
    if (Test-Path $d) { Remove-Item -Recurse -Force $d }
    Copy-Item -Recurse $src $Dest
    Write-Host "  ✓ $s (v$(Get-SkillVersion $d))"
  } else {
    Write-Warning "introuvable : $s"
  }
}
Write-Host "Terminé. Vérifie avec : ./install.ps1 -List  ·  puis redémarre Claude Code."
