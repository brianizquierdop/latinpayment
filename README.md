# 🔐 Integración Gateway Emulator con Zoho Forms/Creator

Documentación completa y ejemplos prácticos para integrar el Gateway Emulator (compatible con Authorize.Net) con Zoho Forms y Zoho Creator.

---

## 📚 Contenido

### Documentación Principal
- **[GUIA_RAPIDA_IMPLEMENTACION.md](GUIA_RAPIDA_IMPLEMENTACION.md)** - ⚡ Comienza aquí para implementación rápida
- **[ZOHO_GATEWAY_INTEGRATION.md](ZOHO_GATEWAY_INTEGRATION.md)** - 📖 Guía completa y detallada

### Ejemplos de Código
- **[zoho-creator-aim-example.deluge](ejemplos/zoho-creator-aim-example.deluge)** - Script Deluge con método AIM
- **[zoho-creator-xml-example.deluge](ejemplos/zoho-creator-xml-example.deluge)** - Script Deluge con XML API
- **[zoho-forms-webhook-config.json](ejemplos/zoho-forms-webhook-config.json)** - Configuración de webhook
- **[zoho-forms-html-integration.html](ejemplos/zoho-forms-html-integration.html)** - Formulario HTML de ejemplo

---

## 🚀 Inicio Rápido

### 1. Obtén tus Credenciales
```
x_login: "api_key"
x_tran_key: [Tu Security Key del Gateway]
```

### 2. Elige tu Plataforma

#### Para Zoho Creator (Recomendado):
```deluge
response = invokeurl [
    url: "https://secure.networkmerchants.com/gateway/transact.dll"
    type: POST
    parameters: {
        "x_login": "api_key",
        "x_tran_key": "TU_SECURITY_KEY",
        "x_type": "AUTH_CAPTURE",
        "x_amount": input.Monto.toString(),
        "x_card_num": input.Numero_Tarjeta,
        "x_exp_date": input.Fecha_Exp,
        "x_card_code": input.CVV,
        "x_first_name": input.Nombre,
        "x_last_name": input.Apellido,
        "x_email": input.Email,
        "x_delim_data": "TRUE",
        "x_delim_char": "|"
    }
];
```

#### Para Zoho Forms:
Configura un webhook en: `Configuración → Integraciones → Webhooks`
- URL: `https://secure.networkmerchants.com/gateway/transact.dll`
- Método: `POST`

### 3. Prueba con Credenciales Demo
```
Usuario: demo
Contraseña: password
Tarjeta de Prueba: 4111111111111111
Fecha Exp: 1228
CVV: 123
```

---

## 🎯 Métodos de Integración Disponibles

### 1. AIM (Advanced Integration Method)
**URL**: `https://secure.networkmerchants.com/gateway/transact.dll`
- ✅ Integración directa servidor-a-servidor
- ✅ Respuesta inmediata
- ✅ Más control sobre el flujo
- 📄 Ver: [`zoho-creator-aim-example.deluge`](ejemplos/zoho-creator-aim-example.deluge)

### 2. SIM (Server Integration Method)
**URL**: `https://secure.networkmerchants.com/cart/ausi.php`
- ✅ Redirección al gateway
- ✅ Gateway maneja el formulario de pago
- ✅ Más simple de implementar

### 3. XML API Moderno
**URL**: `https://secure.networkmerchants.com/api/transrequest.php`
- ✅ API más moderna y estructurada
- ✅ Soporta Customer Vault
- ✅ Mejor para integraciones complejas
- 📄 Ver: [`zoho-creator-xml-example.deluge`](ejemplos/zoho-creator-xml-example.deluge)

### 4. Sparrow API
**URL**: `https://secure.networkmerchants.com/api/spar.php`
- ✅ Compatible con SparrowOne
- ✅ Soporta pagos recurrentes

---

## 📊 Estructura del Proyecto

```
.
├── README.md                                    # Este archivo
├── GUIA_RAPIDA_IMPLEMENTACION.md               # Guía rápida
├── ZOHO_GATEWAY_INTEGRATION.md                 # Documentación completa
└── ejemplos/
    ├── zoho-creator-aim-example.deluge         # Ejemplo AIM
    ├── zoho-creator-xml-example.deluge         # Ejemplo XML
    ├── zoho-forms-webhook-config.json          # Config webhook
    └── zoho-forms-html-integration.html        # Formulario HTML
```

---

## 🔒 Seguridad - IMPORTANTE

### ❌ NUNCA:
- Almacenar números de tarjeta completos
- Guardar CVV en base de datos
- Exponer Security Key en código cliente
- Registrar datos sensibles en logs

### ✅ SIEMPRE:
- Usar HTTPS
- Validar datos antes de enviar
- Guardar solo IDs de transacción
- Cumplir con PCI DSS
- Usar tokens para pagos recurrentes

---

## 🧪 Pruebas

### Credenciales de Prueba:
```
Usuario: demo
Contraseña: password
```

### Tarjetas de Prueba:
| Tipo | Número | Exp | CVV |
|------|--------|-----|-----|
| Visa | 4111111111111111 | 1228 | 123 |
| MasterCard | 5424000000000015 | 1228 | 123 |
| Amex | 378282246310005 | 1228 | 1234 |
| Discover | 6011000000000012 | 1228 | 123 |

---

## 📖 Códigos de Respuesta

| Código | Estado | Descripción |
|--------|--------|-------------|
| 1 | ✅ Aprobada | Transacción exitosa |
| 2 | ❌ Rechazada | Transacción rechazada |
| 3 | ⚠️ Error | Error en el procesamiento |
| 4 | 🔍 En Revisión | Requiere revisión manual |

---

## 🛠️ Tipos de Transacciones

### AUTH_CAPTURE
Autorizar y capturar inmediatamente (más común)
```deluge
params.put("x_type", "AUTH_CAPTURE");
```

### AUTH_ONLY
Solo autorizar (capturar después)
```deluge
params.put("x_type", "AUTH_ONLY");
```

### PRIOR_AUTH_CAPTURE
Capturar una autorización previa
```deluge
params.put("x_type", "PRIOR_AUTH_CAPTURE");
params.put("x_trans_id", "ID_TRANSACCION");
```

### CREDIT
Reembolsar una transacción
```deluge
params.put("x_type", "CREDIT");
params.put("x_trans_id", "ID_TRANSACCION");
```

### VOID
Anular una transacción del mismo día
```deluge
params.put("x_type", "VOID");
params.put("x_trans_id", "ID_TRANSACCION");
```

---

## 📋 Checklist de Implementación

### Antes de Empezar
- [ ] Obtener Security Key del gateway
- [ ] Decidir método de integración (AIM, SIM, XML)
- [ ] Revisar requisitos de seguridad PCI
- [ ] Preparar entorno de pruebas

### Durante la Implementación
- [ ] Configurar credenciales (usar demo/password para pruebas)
- [ ] Mapear campos del formulario
- [ ] Implementar validaciones
- [ ] Configurar manejo de respuestas
- [ ] Probar con tarjetas de prueba

### Antes de Producción
- [ ] Probar todos los escenarios (éxito, rechazo, error)
- [ ] Verificar logs y registros
- [ ] Configurar notificaciones
- [ ] Documentar el proceso
- [ ] Cambiar a credenciales de producción
- [ ] Verificar cumplimiento PCI
- [ ] Configurar monitoreo

---

## 🎓 Recursos Adicionales

### Documentación del Gateway
- [Authorize.Net API Reference](https://developer.authorize.net/api/reference/)
- [AIM Integration Guide](https://support.authorize.net/s/article/Authorize-Net-Advanced-Integration-Method-AIM)
- [Response Codes](https://developer.authorize.net/api/reference/responseCodes.html)

### Documentación de Zoho
- [Zoho Creator Deluge Scripting](https://www.zoho.com/creator/help/script/)
- [Zoho Forms Webhooks](https://help.zoho.com/portal/en/kb/forms/integrations/articles/webhooks)
- [Zoho Creator API](https://www.zoho.com/creator/help/api/)

---

## 🆘 Solución de Problemas

### Error: "Transacción Rechazada"
**Solución**: Verificar datos de tarjeta, usar tarjetas de prueba válidas

### Error: "No se puede conectar"
**Solución**: Verificar URL del gateway, revisar firewall

### Error: "Credenciales Inválidas"
**Solución**: Confirmar que x_login = "api_key" y Security Key es correcto

### Más ayuda
Ver sección de solución de problemas en [`GUIA_RAPIDA_IMPLEMENTACION.md`](GUIA_RAPIDA_IMPLEMENTACION.md)

---

## 💡 Ejemplos de Uso

### Ejemplo 1: Pago Simple
```deluge
// Ver archivo completo: ejemplos/zoho-creator-aim-example.deluge
params = Map();
params.put("x_login", "api_key");
params.put("x_tran_key", SECURITY_KEY);
params.put("x_type", "AUTH_CAPTURE");
params.put("x_amount", "10.00");
// ... más parámetros

response = invokeurl [url: GATEWAY_URL type: POST parameters: params];
```

### Ejemplo 2: Pago con Customer Vault
```deluge
// Ver archivo completo: ejemplos/zoho-creator-xml-example.deluge
// Permite guardar información del cliente para pagos futuros
```

### Ejemplo 3: Webhook desde Zoho Forms
```json
// Ver archivo completo: ejemplos/zoho-forms-webhook-config.json
{
  "url": "https://secure.networkmerchants.com/gateway/transact.dll",
  "method": "POST",
  "parameters": {...}
}
```

---

## 🌟 Características Principales

- ✅ Compatible con formato Authorize.Net
- ✅ Soporta múltiples métodos de integración
- ✅ Ejemplos completos en Deluge Script
- ✅ Configuración de webhooks para Zoho Forms
- ✅ Manejo de respuestas y errores
- ✅ Validaciones de seguridad
- ✅ Tarjetas de prueba incluidas
- ✅ Documentación en español
- ✅ Guías paso a paso

---

## 📞 Soporte

### Problemas con el Gateway
Contactar al proveedor del servicio de gateway

### Problemas con Zoho
- [Zoho Creator Help](https://www.zoho.com/creator/help/)
- [Zoho Forms Help](https://www.zoho.com/forms/help/)
- [Zoho Support](https://help.zoho.com/)

---

## 📝 Notas Importantes

1. **Seguridad PCI**: Esta integración debe cumplir con los estándares PCI DSS
2. **Datos Sensibles**: Nunca almacenar números de tarjeta completos o CVV
3. **Pruebas**: Siempre probar con credenciales demo antes de producción
4. **HTTPS**: Todas las comunicaciones deben ser por HTTPS
5. **Validación**: Implementar validaciones tanto en cliente como servidor

---

## 📄 Licencia

Esta documentación y ejemplos son proporcionados como guía de implementación.

---

## 🤝 Contribuciones

Para mejoras o correcciones en la documentación, por favor contacta al administrador del proyecto.

---

## 📅 Última Actualización

Enero 2026 - Versión 1.0

---

## 🎯 Próximos Pasos

1. Lee la [Guía Rápida de Implementación](GUIA_RAPIDA_IMPLEMENTACION.md)
2. Revisa los [ejemplos de código](ejemplos/)
3. Prueba con credenciales demo
4. Implementa en tu proyecto
5. Prueba exhaustivamente
6. Despliega a producción

---

**¡Listo para comenzar! 🚀**

Comienza con la [Guía Rápida](GUIA_RAPIDA_IMPLEMENTACION.md) y sigue los ejemplos paso a paso.
