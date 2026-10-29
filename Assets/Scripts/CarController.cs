using UnityEngine;

[RequireComponent(typeof(Rigidbody))]
public class CarController : MonoBehaviour
{
    [Header("Configurações do Carro")]
    public CarData carData;

    [Header("Componentes Visuais")]
    public Transform[] frontWheels;
    public Transform[] rearWheels;
    public Renderer brakeLightRenderer;

    private Rigidbody rb;
    private float currentSpeedKmh;
    private float throttleInput;
    private float steerInput;

    public float CurrentSpeedKmh => currentSpeedKmh;

    private void Awake()
    {
        rb = GetComponent<Rigidbody>();
        rb.mass = 798f; // Peso mínimo de um F1 moderno (798 kg)
        rb.drag = 0.05f;
        rb.angularDrag = 2.5f;
    }

    private void Update()
    {
        // Entrada de controle (W/S e A/D ou Setas)
        throttleInput = Input.GetAxis("Vertical");
        steerInput = Input.GetAxis("Horizontal");

        currentSpeedKmh = rb.velocity.magnitude * 3.6f;

        // Animação das rodas visíveis esterçando
        if (frontWheels != null)
        {
            foreach (var wheel in frontWheels)
            {
                if (wheel != null)
                {
                    wheel.localRotation = Quaternion.Euler(0f, steerInput * 30f, 0f);
                }
            }
        }

        // Luz de freio traseira (Rain light)
        if (brakeLightRenderer != null)
        {
            brakeLightRenderer.material.color = (throttleInput < -0.1f) ? Color.red : new Color(0.3f, 0f, 0f);
        }
    }

    private void FixedUpdate()
    {
        if (carData == null) return;

        float maxSpeedMs = carData.topSpeedKmh / 3.6f;
        float currentSpeedMs = rb.velocity.magnitude;

        // Aceleração e Frenagem
        if (throttleInput > 0.01f && currentSpeedMs < maxSpeedMs)
        {
            Vector3 force = transform.forward * throttleInput * carData.accelerationRate * rb.mass;
            rb.AddForce(force, ForceMode.Force);
        }
        else if (throttleInput < -0.01f)
        {
            Vector3 brakeForce = -transform.forward * carData.brakeForce * rb.mass;
            rb.AddForce(brakeForce, ForceMode.Force);
        }

        // Esterço manual ágil com downforce aerodinâmico
        if (currentSpeedMs > 0.5f)
        {
            float steerTorque = steerInput * carData.corneringGrip * carData.steeringSpeed;
            rb.AddTorque(Vector3.up * steerTorque * rb.mass, ForceMode.Force);
        }

        // Efeito de Grip Lateral (Anti-derrapagem)
        Vector3 lateralVelocity = transform.right * Vector3.Dot(rb.velocity, transform.right);
        rb.AddForce(-lateralVelocity * rb.mass * 8f * carData.corneringGrip, ForceMode.Force);
    }
}
