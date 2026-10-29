using UnityEngine;

[CreateAssetMenu(fileName = "NewCarData", menuName = "AuraCar/F1 Car Data", order = 1)]
public class CarData : ScriptableObject
{
    [Header("Equipe e Identificação")]
    public string teamName = "Scuderia Rosso";
    public string driverName = "Piloto";
    public Color teamColor = Color.red;

    [Header("Performance de Fórmula 1")]
    [Tooltip("Velocidade máxima real em km/h (ex: 330)")]
    public float topSpeedKmh = 330f;

    [Tooltip("Força de aceleração de motor F1 V6 turbo")]
    public float accelerationRate = 35f;

    [Tooltip("Potência dos freios de carbono")]
    public float brakeForce = 75f;

    [Tooltip("Aderência aerodinâmica e de pneus em curvas (Downforce)")]
    public float corneringGrip = 1.4f;

    [Tooltip("Velocidade de esterço da direção")]
    public float steeringSpeed = 2.5f;
}
