using UnityEngine;
using UnityEngine.SceneManagement;
using System.Collections.Generic;

public enum RaceDifficulty { Easy, Normal, Hard }

public class GameManager : MonoBehaviour
{
    [Header("Configurações do Grande Prêmio")]
    public RaceDifficulty currentDifficulty = RaceDifficulty.Normal;
    public int totalLaps = 3;

    [Header("Grid de Largada")]
    public Transform[] gridSlots; // 6 slots de largada
    public GameObject playerCarPrefab;
    public GameObject aiCarPrefab;
    public CarData[] availableCarTeams;

    [Header("Pontos do Circuito")]
    public Transform[] circuitWaypoints;

    private GameObject playerInstance;
    private List<GameObject> aiInstances = new List<GameObject>();

    private void Start()
    {
        SetupRaceGrid();
    }

    private void SetupRaceGrid()
    {
        if (availableCarTeams == null || availableCarTeams.Length == 0 || gridSlots.Length < 6)
        {
            Debug.LogWarning("Configuração de grid incompleta no GameManager.");
            return;
        }

        // Instancia o jogador no slot 6 (P6 - largando do fundo para escalar o pelotão)
        if (playerCarPrefab != null)
        {
            Transform pSlot = gridSlots[5];
            playerInstance = Instantiate(playerCarPrefab, pSlot.position, pSlot.rotation);
            var controller = playerInstance.GetComponent<CarController>();
            if (controller != null)
            {
                controller.carData = availableCarTeams[0];
            }
        }

        // Instancia os 5 Rivais de IA nos slots P1 a P5
        for (int i = 0; i < 5; i++)
        {
            if (aiCarPrefab != null && i < gridSlots.Length)
            {
                Transform aiSlot = gridSlots[i];
                GameObject aiCar = Instantiate(aiCarPrefab, aiSlot.position, aiSlot.rotation);
                var aiDriver = aiCar.GetComponent<AICarDriver>();
                if (aiDriver != null)
                {
                    aiDriver.carData = availableCarTeams[(i + 1) % availableCarTeams.Length];
                    aiDriver.waypoints = circuitWaypoints;
                    aiDriver.currentWaypointIndex = 1;

                    // Ajusta habilidade por dificuldade
                    switch (currentDifficulty)
                    {
                        case RaceDifficulty.Easy:
                            aiDriver.corneringSkill = 0.70f;
                            break;
                        case RaceDifficulty.Normal:
                            aiDriver.corneringSkill = 0.85f;
                            break;
                        case RaceDifficulty.Hard:
                            aiDriver.corneringSkill = 0.96f;
                            break;
                    }
                }
                aiInstances.Add(aiCar);
            }
        }
    }

    public void RestartRace()
    {
        SceneManager.LoadScene(SceneManager.GetActiveScene().buildIndex);
    }
}
