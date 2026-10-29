using UnityEngine;

[RequireComponent(typeof(Rigidbody))]
public class AICarDriver : MonoBehaviour
{
    [Header("Configurações do Piloto IA")]
    public CarData carData;
    public Transform[] waypoints;
    public int currentWaypointIndex = 0;

    [Header("Comportamento Dinâmico de Corrida")]
    [Tooltip("Habilidade de frear antes da curva (0.7 a 1.0)")]
    public float corneringSkill = 0.85f;

    private Rigidbody rb;

    private void Awake()
    {
        rb = GetComponent<Rigidbody>();
        rb.mass = 798f;
        rb.drag = 0.05f;
    }

    private void FixedUpdate()
    {
        if (waypoints == null || waypoints.Length == 0 || carData == null) return;

        Transform targetWp = waypoints[currentWaypointIndex];
        Vector3 dirToTarget = (targetWp.position - transform.position);
        dirToTarget.y = 0;

        float distToTarget = dirToTarget.magnitude;
        if (distToTarget < 12f)
        {
            currentWaypointIndex = (currentWaypointIndex + 1) % waypoints.Length;
        }

        Vector3 desiredDir = dirToTarget.normalized;
        float angleToTarget = Vector3.SignedAngle(transform.forward, desiredDir, Vector3.up);

        // Curvatura: se o ângulo para o próximo ponto for alto, a IA freia para contornar a curva!
        bool isCorner = Mathf.Abs(angleToTarget) > 15f;
        float targetSpeedKmh = isCorner ? (140f * corneringSkill) : carData.topSpeedKmh;
        float currentSpeedKmh = rb.velocity.magnitude * 3.6f;

        // Aceleração ou Frenagem
        if (currentSpeedKmh < targetSpeedKmh)
        {
            rb.AddForce(transform.forward * carData.accelerationRate * rb.mass, ForceMode.Force);
        }
        else if (currentSpeedKmh > targetSpeedKmh + 10f)
        {
            rb.AddForce(-transform.forward * carData.brakeForce * 0.7f * rb.mass, ForceMode.Force);
        }

        // Esterço em direção ao traçado
        float steerAmount = Mathf.Clamp(angleToTarget / 40f, -1f, 1f);
        rb.AddTorque(Vector3.up * steerAmount * carData.corneringGrip * rb.mass * 3f, ForceMode.Force);

        // Estabilização lateral
        Vector3 lateralVel = transform.right * Vector3.Dot(rb.velocity, transform.right);
        rb.AddForce(-lateralVel * rb.mass * 7f, ForceMode.Force);
    }
}
