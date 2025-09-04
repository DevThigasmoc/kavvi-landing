# KAVVI CRM Landing Page - Backend Integration Contracts

## API Endpoints to Implement

### 1. Form Submission Endpoint
**Route:** `POST /api/landings/submit`

**Request Payload:**
```json
{
  "name": "string (required)",
  "email": "string (required, email format)",
  "whatsapp": "string (required, will be normalized to E.164)",
  "company": "string (optional)",
  "notes": "string (optional)",
  "action_type": "trial|demo",
  "utm": {
    "utm_source": "string",
    "utm_medium": "string", 
    "utm_campaign": "string",
    "utm_term": "string",
    "utm_content": "string",
    "gclid": "string",
    "gbraid": "string",
    "wbraid": "string",
    "fbclid": "string",
    "msclkid": "string",
    "referrer": "string",
    "device": "string",
    "placement": "string",
    "dkinsertion": "string"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Cadastro realizado com sucesso!",
  "trial_expires": "2025-01-07T10:30:00Z", // for trial
  "demo_scheduled": "2025-01-05T15:00:00Z", // for demo
  "calendar_event_id": "google_event_id" // for demo
}
```

### 2. Demo Scheduling Endpoint
**Route:** `POST /api/demo/schedule`

**Request Payload:**
```json
{
  "name": "string",
  "email": "string", 
  "whatsapp": "string",
  "company": "string",
  "preferred_datetime": "ISO datetime",
  "timezone": "America/Sao_Paulo",
  "utm": { /* same as above*/ }
}
```

### 3. Analytics Events Endpoint
**Route:** `POST /api/analytics/track`

**Request Payload:**
```json
{
  "event": "landing_view|cta_click|form_submit|trial_started|demo_scheduled",
  "properties": {
    "page": "whatsapp-lead-generation",
    "utm_source": "string",
    "utm_medium": "string",
    "utm_campaign": "string",
    "utm_term": "string", 
    "utm_content": "string",
    "gclid": "string",
    "referrer": "string",
    "user_agent": "string",
    "ip_address": "string"
  }
}
```

## External API Integration

### KAVVI API Integration
**Endpoint:** `POST https://api.kavvicrm.com.br/landings/submit`
**Headers:** 
- `Authorization: Bearer {LANDINGS_SUBMIT_SECRET}`
- `Content-Type: application/json`

**Payload Format:**
```json
{
  "name": "normalized_name",
  "email": "validated_email",
  "whatsapp": "+5511999999999", // E.164 format
  "company": "company_name",
  "notes": "additional_notes",  
  "source": "landing-whatsapp",
  "utm": { /* complete UTM object */ }
}
```

### Google Calendar Integration
**OAuth Flow:**
1. Redirect to Google OAuth with calendar.events scope
2. Handle callback at `/api/oauth/google/callback`
3. Store access token securely
4. Create calendar event with lead details

**Event Details:**
- Title: "Demo KAVVI CRM - {lead_name}"
- Description: Include lead phone, company, ticket link
- Duration: 30 minutes
- Attendees: lead email + sales rep

### Analytics Integration
**Endpoint:** `POST https://api.kavvicrm.com.br/events/ingest`
**Headers:**
- `Content-Type: application/json`
- `X-Tenant: kavvi-site`

## Data Transformations

### WhatsApp Normalization
- Remove: `()`, `-`, spaces
- Add country code if missing: `+55`
- Validate: Must match E.164 format `+55[0-9]{10,11}`

### Email Validation
- Standard email regex validation
- Domain existence check (optional)

### UTM Capture
- Extract from request headers/query params
- Store: utm_source, utm_medium, utm_campaign, utm_term, utm_content
- Track: gclid, fbclid, referrer, user_agent

## Security & Rate Limiting

### Rate Limiting
- IP-based: 5 submissions per hour per IP
- Email-based: 3 submissions per day per email

### Honeypot Protection
- Add hidden field `website` - reject if filled
- Add timestamp validation - reject if too fast (<3 seconds)

### Input Sanitization
- Escape HTML in all text fields
- Validate all required fields
- Maximum length limits on all inputs

## Mock Data to Replace

### Frontend Mock Data (src/data/site.js)
```javascript
// These will be replaced with real backend data:
testimonials: [/* 2 testimonials */],
companies: [/* 4 company logos */], 
metrics: [/* 3 performance metrics */]
```

### Environment Variables Needed
```env
# External APIs
LANDINGS_SUBMIT_SECRET=secret_token_here
EVENTS_INGEST_URL=https://api.kavvicrm.com.br/events/ingest

# Google Calendar
GOOGLE_CLIENT_ID=google_oauth_client_id
GOOGLE_CLIENT_SECRET=google_oauth_secret  
GOOGLE_REDIRECT_URI=https://app.kavvicrm.com.br/oauth2/callback/google

# Security
RATE_LIMIT_WINDOW=3600
RATE_LIMIT_MAX=5
```

## Error Messages (Portuguese)

```javascript
const errorMessages = {
  required_field: "Este campo é obrigatório",
  invalid_email: "Por favor, insira um email válido", 
  invalid_whatsapp: "Por favor, insira um WhatsApp válido (ex: 11999999999)",
  rate_limit: "Muitas tentativas. Tente novamente em alguns minutos",
  server_error: "Erro interno. Tente novamente em alguns instantes",
  network_error: "Erro de conexão. Verifique sua internet",
  demo_conflict: "Horário não disponível. Escolha outro horário",
  trial_exists: "Você já possui um trial ativo"
};
```

## Frontend Integration Points

### Form Submission (HeroSection.js, FinalCtaSection.js)
- Replace `console.log()` calls with actual API calls
- Add loading states and error handling
- Show success messages and next steps

### UTM Tracking (App.js)
- Capture UTM parameters on page load
- Store in context/state for form submissions
- Send analytics events on key interactions

### Demo Scheduling Modal
- Create new component for date/time selection
- Integrate with Google Calendar availability
- Handle timezone conversion (America/Sao_Paulo)

## Testing Requirements

### Backend Testing
- Form validation (happy path + edge cases)
- WhatsApp normalization
- Rate limiting functionality  
- External API integration (mock in tests)
- Analytics event tracking

### Integration Testing
- Complete form submission flow
- Demo scheduling end-to-end
- UTM parameter capture and tracking
- Error handling and user feedback