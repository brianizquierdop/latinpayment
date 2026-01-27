# Guía de Integración: Gateway Emulator con Zoho Forms/Creator

## Resumen Ejecutivo

El Gateway Emulator permite procesar pagos emulando el formato de Authorize.Net. Esta guía explica cómo integrarlo con **Zoho Forms** o **Zoho Creator**.

---

## 🔑 Conceptos Clave

### ¿Qué es el Gateway Emulator?

Es un sistema que acepta transacciones en el formato de Authorize.Net, permitiendo que aplicaciones de terceros procesen pagos sin modificar su código base, solo cambiando la URL de destino.

### Métodos Soportados

1. **AIM (Advanced Integration Method)** - Integración directa servidor-a-servidor
2. **SIM (Server Integration Method)** - Integración con redirección
3. **XML API Moderno** - API XML actual de Authorize.Net
4. **Sparrow API** - Para aplicaciones que usan SparrowOne

---

## 📋 URLs del Gateway Emulator

### Método AIM
```
https://secure.networkmerchants.com/gateway/transact.dll
```

### Método SIM
```
https://secure.networkmerchants.com/cart/ausi.php
```

### XML API Moderno
```
https://secure.networkmerchants.com/api/transrequest.php
```

### Sparrow API
```
https://secure.networkmerchants.com/api/spar.php
```

---

## 🔐 Credenciales de Autenticación

### Para AIM/SIM:
- **x_login**: Siempre usar `"api_key"`
- **x_tran_key**: Tu clave de seguridad (Security Key)
- **MD5 Hash**: La palabra `"gateway"` (sin comillas)

### Para XML API Moderno:
- **name**: Cualquier valor (no se usa para autenticación)
- **transactionKey**: Tu API Security Key

### Para Sparrow API:
- **mkey**: Tu API Security Key

### Credenciales de Prueba:
- **Usuario**: `demo`
- **Contraseña**: `password`

---

## 🎯 Integración con Zoho Forms

### Opción 1: Webhook con AIM (Recomendado)

Zoho Forms puede enviar datos a través de webhooks. Configura un webhook que envíe datos POST al Gateway:

#### Pasos:

1. **En Zoho Forms**, ve a: `Configuración → Integraciones → Webhooks`

2. **Configura el Webhook**:
   - URL: `https://secure.networkmerchants.com/gateway/transact.dll`
   - Método: `POST`
   - Tipo de contenido: `application/x-www-form-urlencoded`

3. **Mapea los campos del formulario** a los parámetros requeridos:

```javascript
// Parámetros mínimos requeridos
{
  "x_login": "api_key",
  "x_tran_key": "TU_SECURITY_KEY_AQUI",
  "x_type": "AUTH_CAPTURE",  // o "AUTH_ONLY"
  "x_amount": "${campo_monto}",
  "x_card_num": "${campo_tarjeta}",
  "x_exp_date": "${campo_expiracion}",  // Formato: MMYY
  "x_card_code": "${campo_cvv}",
  "x_first_name": "${campo_nombre}",
  "x_last_name": "${campo_apellido}",
  "x_email": "${campo_email}",
  "x_delim_data": "TRUE",
  "x_delim_char": "|",
  "x_relay_response": "FALSE"
}
```

### Opción 2: Integración con Deluge Script (Zoho Creator)

Si usas Zoho Creator, puedes usar Deluge Script para hacer la llamada POST:

```deluge
// Script de Deluge para procesar pago
response = invokeurl
[
    url: "https://secure.networkmerchants.com/gateway/transact.dll"
    type: POST
    parameters: {
        "x_login": "api_key",
        "x_tran_key": "TU_SECURITY_KEY_AQUI",
        "x_type": "AUTH_CAPTURE",
        "x_amount": input.Monto,
        "x_card_num": input.Numero_Tarjeta,
        "x_exp_date": input.Fecha_Expiracion,
        "x_card_code": input.CVV,
        "x_first_name": input.Nombre,
        "x_last_name": input.Apellido,
        "x_email": input.Email,
        "x_delim_data": "TRUE",
        "x_delim_char": "|",
        "x_relay_response": "FALSE"
    }
];

// Procesar respuesta
info response;
```

---

## 🎯 Integración con Zoho Creator

### Método 1: Usando XML API (Más Moderno)

```deluge
// Construir XML para la transacción
xmlData = "<createTransactionRequest xmlns='AnetApi/xml/v1/schema/AnetApiSchema.xsd'>" +
    "<merchantAuthentication>" +
        "<name>cualquier_valor</name>" +
        "<transactionKey>TU_SECURITY_KEY_AQUI</transactionKey>" +
    "</merchantAuthentication>" +
    "<transactionRequest>" +
        "<transactionType>authCaptureTransaction</transactionType>" +
        "<amount>" + input.Monto + "</amount>" +
        "<payment>" +
            "<creditCard>" +
                "<cardNumber>" + input.Numero_Tarjeta + "</cardNumber>" +
                "<expirationDate>" + input.Fecha_Exp + "</expirationDate>" +
                "<cardCode>" + input.CVV + "</cardCode>" +
            "</creditCard>" +
        "</payment>" +
        "<billTo>" +
            "<firstName>" + input.Nombre + "</firstName>" +
            "<lastName>" + input.Apellido + "</lastName>" +
            "<email>" + input.Email + "</email>" +
        "</billTo>" +
    "</transactionRequest>" +
"</createTransactionRequest>";

// Enviar solicitud
response = invokeurl
[
    url: "https://secure.networkmerchants.com/api/transrequest.php"
    type: POST
    parameters: xmlData
    headers: {"Content-Type": "application/xml"}
];

// Procesar respuesta XML
info response;
```

### Método 2: Formulario con Redirección (SIM)

Para un formulario que redirija al usuario al gateway:

```html
<form method="POST" action="https://secure.networkmerchants.com/cart/ausi.php">
    <input type="hidden" name="x_login" value="api_key">
    <input type="hidden" name="x_tran_key" value="TU_SECURITY_KEY_AQUI">
    <input type="hidden" name="x_amount" value="${monto}">
    <input type="hidden" name="x_show_form" value="PAYMENT_FORM">
    <input type="hidden" name="x_type" value="AUTH_CAPTURE">
    <input type="hidden" name="x_relay_response" value="TRUE">
    <input type="hidden" name="x_relay_url" value="https://tu-sitio.com/respuesta">
    
    <button type="submit">Pagar Ahora</button>
</form>
```

---

## 📊 Parámetros Importantes

### Tipos de Transacción (x_type):
- `AUTH_CAPTURE` - Autorizar y capturar inmediatamente
- `AUTH_ONLY` - Solo autorizar (capturar después)
- `CREDIT` - Reembolso
- `VOID` - Anular transacción

### Campos Obligatorios Mínimos:
- `x_login` / `name`
- `x_tran_key` / `transactionKey`
- `x_type` / `transactionType`
- `x_amount` / `amount`
- Información de la tarjeta (número, fecha exp, CVV)

### Campos Opcionales Recomendados:
- Información del cliente (nombre, email, dirección)
- Número de orden (`x_invoice_num`)
- Descripción (`x_description`)
- ID de cliente (`x_cust_id`)

---

## 🔒 Consideraciones de Seguridad

### ⚠️ IMPORTANTE - Cumplimiento PCI:

1. **NUNCA almacenes datos de tarjetas** en Zoho Forms/Creator
2. **Usa HTTPS** siempre
3. **No registres números de tarjeta** en logs
4. **Considera usar tokenización** para pagos recurrentes

### Mejores Prácticas:

1. **Validación del lado del cliente**: Valida formato de tarjeta antes de enviar
2. **Manejo de errores**: Implementa manejo robusto de respuestas
3. **Pruebas**: Usa credenciales de prueba (`demo`/`password`) primero
4. **Logs seguros**: Registra solo IDs de transacción, no datos sensibles

---

## 📝 Ejemplo Completo: Zoho Creator

```deluge
// Función para procesar pago
void procesarPago(string nombre, string apellido, string email, 
                  string numeroTarjeta, string fechaExp, string cvv, 
                  decimal monto)
{
    try
    {
        // Preparar parámetros
        params = Map();
        params.put("x_login", "api_key");
        params.put("x_tran_key", "TU_SECURITY_KEY_AQUI");
        params.put("x_type", "AUTH_CAPTURE");
        params.put("x_amount", monto.toString());
        params.put("x_card_num", numeroTarjeta);
        params.put("x_exp_date", fechaExp);
        params.put("x_card_code", cvv);
        params.put("x_first_name", nombre);
        params.put("x_last_name", apellido);
        params.put("x_email", email);
        params.put("x_delim_data", "TRUE");
        params.put("x_delim_char", "|");
        params.put("x_relay_response", "FALSE");
        
        // Enviar solicitud
        response = invokeurl
        [
            url: "https://secure.networkmerchants.com/gateway/transact.dll"
            type: POST
            parameters: params
        ];
        
        // Parsear respuesta (delimitada por |)
        respuestaArray = response.toList("|");
        codigoRespuesta = respuestaArray.get(0);
        
        if(codigoRespuesta == "1")
        {
            // Transacción aprobada
            transaccionID = respuestaArray.get(6);
            info "Pago aprobado. ID: " + transaccionID;
            return true;
        }
        else
        {
            // Transacción rechazada
            mensajeError = respuestaArray.get(3);
            info "Pago rechazado: " + mensajeError;
            return false;
        }
    }
    catch(e)
    {
        info "Error al procesar pago: " + e;
        return false;
    }
}
```

---

## 🧪 Pruebas

### Credenciales de Prueba:
- **Usuario**: `demo`
- **Contraseña**: `password`

### Tarjetas de Prueba (Authorize.Net estándar):
- **Visa**: `4111111111111111`
- **MasterCard**: `5424000000000015`
- **American Express**: `378282246310005`
- **Discover**: `6011000000000012`

### Fechas de Expiración de Prueba:
- Cualquier fecha futura (ej: `12/28` para diciembre 2028)

### CVV de Prueba:
- Cualquier 3-4 dígitos (ej: `123` o `1234`)

---

## 📞 Códigos de Respuesta

### Código de Respuesta (Primer campo):
- `1` = Aprobada
- `2` = Rechazada
- `3` = Error
- `4` = En espera de revisión

### Estructura de Respuesta Delimitada:
```
1|1|1|Transacción aprobada|código_auth|P|ID_transacción|...
```

Campos principales:
1. Código de respuesta
2. Código de sub-respuesta
3. Código de razón
4. Texto de respuesta
5. Código de autorización
6. Tipo de respuesta AVS
7. ID de transacción

---

## 🚀 Pasos para Implementar

### Checklist de Implementación:

- [ ] Obtener credenciales del gateway (Security Key)
- [ ] Decidir método de integración (AIM, SIM, o XML)
- [ ] Configurar webhook en Zoho Forms o script en Zoho Creator
- [ ] Mapear campos del formulario a parámetros del gateway
- [ ] Implementar manejo de respuestas
- [ ] Probar con credenciales de prueba (`demo`/`password`)
- [ ] Implementar validaciones y manejo de errores
- [ ] Revisar cumplimiento PCI
- [ ] Probar con credenciales de producción
- [ ] Monitorear transacciones iniciales

---

## ⚡ Limitaciones Conocidas

El Gateway Emulator **NO soporta**:
- XML AIM (versión antigua)
- CIM (Customer Information Manager)
- ARB (Automated Recurring Billing)
- DPM (Direct Post Method)
- Card Present (terminales físicas)
- Transaction Details APIs

**Sí soporta**:
- CIT/MIT (Customer/Merchant Initiated Transactions)
- Customer Vault (para tokenización)
- Transacciones recurrentes vía Sparrow API

---

## 📚 Recursos Adicionales

### Documentación Relacionada:
- Authorize.Net AIM Guide
- Authorize.Net SIM Guide
- Zoho Creator Deluge Scripting
- Zoho Forms Webhooks Documentation

### Variables CIT/MIT:
Para transacciones iniciadas por cliente o comerciante, usa las variables documentadas en el Payment API del gateway.

---

## 💡 Recomendaciones Finales

1. **Para Zoho Forms**: Usa webhooks con método AIM para integración directa
2. **Para Zoho Creator**: Usa Deluge Script con XML API para mayor control
3. **Seguridad**: Nunca expongas tu Security Key en código del lado del cliente
4. **Testing**: Siempre prueba exhaustivamente con credenciales de prueba
5. **Monitoreo**: Implementa logging de transacciones (sin datos sensibles)
6. **Respaldo**: Ten un plan B para procesar pagos manualmente si falla la integración

---

## 📧 Soporte

Para problemas específicos del gateway, contacta al proveedor del servicio.
Para problemas con Zoho, consulta la documentación oficial de Zoho o su soporte técnico.

---

**Última actualización**: Enero 2026
**Versión**: 1.0
