using UnityEditor;
using UnityEditor.Build.Reporting;
using UnityEngine;

public static class BuildGame
{
    [MenuItem("AuraCar/Construir Jogo Standalone (Windows 64-bit)")]
    public static void BuildWindows64()
    {
        string[] scenes = { "Assets/Scenes/F1GrandPrix.unity" };
        string buildPath = "Builds/Windows64/AuraCar_F1.exe";

        BuildPlayerOptions buildPlayerOptions = new BuildPlayerOptions
        {
            scenes = scenes,
            locationPathName = buildPath,
            target = BuildTarget.StandaloneWindows64,
            options = BuildOptions.None,
        };

        BuildReport report = BuildPipeline.BuildPlayer(buildPlayerOptions);
        BuildSummary summary = report.summary;

        if (summary.result == BuildResult.Succeeded)
        {
            Debug.Log($"[AuraCar] Build concluída com sucesso: {summary.totalSize / (1024 * 1024):F2} MB");
        }
        else if (summary.result == BuildResult.Failed)
        {
            Debug.LogError("[AuraCar] Falha ao construir o executável.");
        }
    }
}
