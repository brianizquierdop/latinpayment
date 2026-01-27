# 🚀 Guía Rápida de Implementación

## Gateway Emulator con Zoho Forms/Creator

---

## ⚡ Inicio Rápido (5 minutos)

### Paso 1: Obtén tus Credenciales
```
x_login: "api_key"
x_tran_key: [Tu Security Key del Gateway]
```

### Paso 2: Elige tu Método de Integración

#### 🔷 Para Zoho Forms → Usa Webhook
```
URL: https://secure.networkmerchants.com/gateway/transact.dll
Método: POST
```

#### 🔷 Para Zoho Creator → Usa Deluge Script
```deluge
response = invokeurl [
    url: "https://secure.networkmerchants.com/gateway/transact.dll"
    type: POST
    parameters: {...}
];
```

---

## 📋 Checklist de Implementación

### Antes de Empezar
- [ ] Obtener Security Key del gateway
- [ ] Decidir método (AIM, SIM o XML)
- [ ] Revisar documentación de seguridad PCI
- [ ] Preparar entorno de pruebas

### Durante la Implementación
- [ ] Configurar credenciales (usar `demo`/`password` para pruebas)
- [ ] Mapear campos del formulario
- [ ] Implementar validaciones
- [ ] Configurar manejo de respuestas
- [ ] Probar con tarjetas de prueba

### Después de Implementar
- [ ] Probar todos los escenarios (éxito, rechazo, error)
- [ ] Verificar logs y registros
- [ ] Configurar notificaciones
- [ ] Documentar el proceso
- [ ] Cambiar a credenciales de producción

---

## 🎯 Opción 1: Zoho Forms con Webhook

### Configuración en Zoho Forms:

1. **Ir a**: Configuración → Integraciones → Webhooks

2. **Configurar**:
   - URL: `https://secure.networkmerchants.com/gateway/transact.dll`
   - Método: `POST`
   - Content-Type: `application/x-www-form-urlencoded`

3. **Mapear Campos**:
```json
{
  "x_login": "api_key",
  "x_tran_key": "TU_SECURITY_KEY",
  "x_type": "AUTH_CAPTURE",
  "x_amount": "${campo_monto}",
  "x_card_num": "${campo_tarjeta}",
  "x_exp_date": "${campo_expiracion}",
  "x_card_code": "${campo_cvv}",
  "x_first_name": "${campo_nombre}",
  "x_last_name": "${campo_apellido}",
  "x_email": "${campo_email}",
  "x_delim_data": "TRUE",
  "x_delim_char": "|"
}
```

### ⚠️ Limitación Importante:
Zoho Forms tiene limitaciones para manejar datos sensibles de tarjetas. **Recomendación**: Usar Zoho Creator para mayor control.

---

## 🎯 Opción 2: Zoho Creator con Deluge (Recomendado)

### Script Básico:

```deluge
// Configuración
GATEWAY_URL = "https://secure.networkmerchants.com/gateway/transact.dll";
SECURITY_KEY = "TU_SECURITY_KEY_AQUI";

// Preparar parámetros
params = Map();
params.put("x_login", "api_key");
params.put("x_tran_key", SECURITY_KEY);
params.put("x_type", "AUTH_CAPTURE");
params.put("x_amount", input.Monto.toString());
params.put("x_card_num", input.Numero_Tarjeta);
params.put("x_exp_date", input.Fecha_Exp);
params.put("x_card_code", input.CVV);
params.put("x_first_name", input.Nombre);
params.put("x_last_name", input.Apellido);
params.put("x_email", input.Email);
params.put("x_delim_data", "TRUE");
params.put("x_delim_char", "|");

// Enviar
try {
    respuesta = invokeurl [
        url: GATEWAY_URL
        type: POST
        parameters: params
    ];
    
    // Procesar respuesta
    campos = respuesta.toList("|");
    codigo = campos.get(0);
    
    if(codigo == "1") {
        // ✅ Aprobado
        transID = campos.get(6);
        alert "Pago aprobado! ID: " + transID;
    } else {
        // ❌ Rechazado
        mensaje = campos.get(3);
        alert "Pago rechazado: " + mensaje;
    }
} catch(e) {
    alert "Error: " + e;
}
```

---

## 🧪 Pruebas

### Credenciales de Prueba:
```
Usuario: demo
Contraseña: password
```

### Tarjetas de Prueba:
```
Visa:       4111111111111111
MasterCard: 5424000000000015
Amex:       378282246310005
Discover:   6011000000000012

Fecha Exp:  1228 (Diciembre 2028)
CVV:        123
Monto:      10.00
```

### Probar Escenarios:

#### ✅ Transacción Exitosa:
```
Monto: 10.00
Tarjeta: 4111111111111111
Resultado Esperado: Código 1 (Aprobada)
```

#### ❌ Transacción Rechazada:
```
Monto: 0.01
Tarjeta: 4111111111111111
Resultado Esperado: Código 2 (Rechazada)
```

#### ⚠️ Error de Validación:
```
Monto: -10.00
Resultado Esperado: Error de validación
```

---

## 📊 Interpretar Respuestas

### Formato de Respuesta:
```
1|1|1|Transacción aprobada|AUTH123|Y|987654321|INV001|Descripción|10.00|CC|auth_capture
```

### Campos Principales:
```
[0] = Código de Respuesta (1=Aprobada, 2=Rechazada, 3=Error)
[3] = Mensaje de Respuesta
[4] = Código de Autorización
[6] = ID de Transacción
```

### Códigos de Respuesta:
- **1** = ✅ Aprobada
- **2** = ❌ Rechazada
- **3** = ⚠️ Error
- **4** = 🔍 En Revisión

---

## 🔒 Seguridad - IMPORTANTE

### ❌ NUNCA Hacer:
- Almacenar números de tarjeta completos
- Guardar CVV en base de datos
- Enviar datos sensibles por email
- Registrar datos de tarjetas en logs
- Exponer Security Key en código cliente

### ✅ SIEMPRE Hacer:
- Usar HTTPS
- Validar datos antes de enviar
- Guardar solo IDs de transacción
- Implementar rate limiting
- Cumplir con PCI DSS
- Usar tokens para pagos recurrentes

### Datos Seguros para Guardar:
```
✅ ID de Transacción
✅ Código de Autorización
✅ Últimos 4 dígitos de tarjeta
✅ Tipo de tarjeta (Visa, MC, etc)
✅ Estado de transacción
✅ Monto
✅ Fecha/hora
```

---

## 🛠️ Solución de Problemas

### Error: "Transacción Rechazada"
**Causas comunes:**
- Tarjeta inválida o expirada
- Fondos insuficientes
- Datos incorrectos (CVV, fecha exp)
- Límite de transacciones excedido

**Solución:**
- Verificar datos de la tarjeta
- Usar tarjetas de prueba válidas
- Revisar logs del gateway

### Error: "No se puede conectar"
**Causas comunes:**
- URL incorrecta
- Firewall bloqueando conexión
- Timeout de red

**Solución:**
- Verificar URL del gateway
- Revisar configuración de firewall
- Aumentar timeout de conexión

### Error: "Credenciales Inválidas"
**Causas comunes:**
- Security Key incorrecto
- x_login no es "api_key"
- Credenciales de prueba vs producción

**Solución:**
- Verificar Security Key
- Confirmar x_login = "api_key"
- Usar demo/password para pruebas

---

## 📞 Tipos de Transacciones

### AUTH_CAPTURE (Autorizar y Capturar)
```deluge
params.put("x_type", "AUTH_CAPTURE");
```
**Uso**: Cobro inmediato. Más común.

### AUTH_ONLY (Solo Autorizar)
```deluge
params.put("x_type", "AUTH_ONLY");
```
**Uso**: Reservar fondos, cobrar después.

### PRIOR_AUTH_CAPTURE (Capturar Autorización)
```deluge
params.put("x_type", "PRIOR_AUTH_CAPTURE");
params.put("x_trans_id", "ID_TRANSACCION");
```
**Uso**: Cobrar una autorización previa.

### CREDIT (Reembolso)
```deluge
params.put("x_type", "CREDIT");
params.put("x_trans_id", "ID_TRANSACCION");
params.put("x_card_num", "1111"); // Últimos 4 dígitos
```
**Uso**: Devolver dinero al cliente.

### VOID (Anular)
```deluge
params.put("x_type", "VOID");
params.put("x_trans_id", "ID_TRANSACCION");
```
**Uso**: Cancelar transacción del mismo día.

---

## 🎨 Campos Opcionales Útiles

### Información de Orden:
```deluge
params.put("x_invoice_num", "INV-001");
params.put("x_description", "Compra de productos");
params.put("x_po_num", "PO-12345");
```

### Impuestos y Envío:
```deluge
params.put("x_tax", "5.00");
params.put("x_freight", "10.00");
params.put("x_duty", "2.00");
```

### Dirección de Envío:
```deluge
params.put("x_ship_to_first_name", "Juan");
params.put("x_ship_to_last_name", "Pérez");
params.put("x_ship_to_address", "Calle 123");
params.put("x_ship_to_city", "Ciudad");
params.put("x_ship_to_state", "Estado");
params.put("x_ship_to_zip", "12345");
```

### Información Adicional:
```deluge
params.put("x_customer_ip", "192.168.1.1");
params.put("x_cust_id", "CUST-001");
params.put("x_company", "Mi Empresa");
```

---

## 📈 Mejores Prácticas

### 1. Validación del Cliente
```deluge
// Validar antes de enviar
if(input.Monto <= 0) {
    alert "Monto inválido";
    return;
}

if(input.Numero_Tarjeta.length() < 13) {
    alert "Tarjeta inválida";
    return;
}
```

### 2. Manejo de Errores
```deluge
try {
    // Procesar pago
} catch(e) {
    // Registrar error
    info "Error: " + e;
    // Notificar admin
    sendmail [...]
    // Mostrar mensaje amigable
    alert "Error al procesar. Contacte soporte.";
}
```

### 3. Logging Seguro
```deluge
// ✅ BIEN - Solo info no sensible
info "Transacción procesada. ID: " + transID;

// ❌ MAL - Datos sensibles
info "Tarjeta: " + numeroTarjeta; // NUNCA HACER ESTO
```

### 4. Notificaciones
```deluge
if(codigo == "1") {
    // Enviar email de confirmación
    sendmail [
        from: "noreply@tuempresa.com"
        to: input.Email
        subject: "Pago Confirmado"
        message: "Su pago de $" + input.Monto + " fue procesado."
    ];
}
```

---

## 🔄 Flujo Completo Recomendado

```
1. Usuario completa formulario
   ↓
2. Validar datos en cliente (JavaScript)
   ↓
3. Enviar a Zoho Creator
   ↓
4. Validar datos en servidor (Deluge)
   ↓
5. Enviar al Gateway
   ↓
6. Recibir respuesta
   ↓
7. Procesar respuesta
   ↓
8. Guardar resultado (solo datos seguros)
   ↓
9. Notificar al usuario
   ↓
10. Enviar confirmación por email
```

---

## 📚 Recursos Incluidos

### Archivos de Ejemplo:
- [`ZOHO_GATEWAY_INTEGRATION.md`](ZOHO_GATEWAY_INTEGRATION.md) - Guía completa
- [`ejemplos/zoho-creator-aim-example.deluge`](ejemplos/zoho-creator-aim-example.deluge) - Script AIM
- [`ejemplos/zoho-creator-xml-example.deluge`](ejemplos/zoho-creator-xml-example.deluge) - Script XML
- [`ejemplos/zoho-forms-webhook-config.json`](ejemplos/zoho-forms-webhook-config.json) - Config webhook
- [`ejemplos/zoho-forms-html-integration.html`](ejemplos/zoho-forms-html-integration.html) - Formulario HTML

---

## ✅ Checklist Final

Antes de ir a producción:

- [ ] Probado con credenciales demo/password
- [ ] Probado con todas las tarjetas de prueba
- [ ] Validaciones implementadas
- [ ] Manejo de errores implementado
- [ ] Logging configurado (sin datos sensibles)
- [ ] Notificaciones funcionando
- [ ] Cumplimiento PCI verificado
- [ ] Documentación actualizada
- [ ] Credenciales de producción configuradas
- [ ] Monitoreo activo

---

## 🆘 Soporte

### Problemas con el Gateway:
Contactar al proveedor del gateway

### Problemas con Zoho:
- Documentación: https://www.zoho.com/creator/help/
- Soporte: https://help.zoho.com/

### Problemas con esta Integración:
Revisar los archivos de ejemplo y la documentación completa.

---

**¡Listo para empezar! 🚀**

Comienza con las credenciales de prueba y sigue el checklist paso a paso.
