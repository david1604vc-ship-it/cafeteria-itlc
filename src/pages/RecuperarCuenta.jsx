import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'
import './Recovery.css'

function RecuperarCuenta() {
  const navigate = useNavigate()
  const [telefono, setTelefono] = useState('')
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)

  const handleEnviar = async () => {
    setError('')
    if (!telefono || telefono.length !== 10) {
      setError('Ingresa un número de teléfono válido de 10 dígitos')
      return
    }
    setCargando(true)
    try {
      await api.post('/auth/recuperar/enviar', { telefono })
      // Guardamos el teléfono para usarlo en los siguientes pasos
      sessionStorage.setItem('recuperar_telefono', telefono)
      navigate('/verificar-codigo')
    } catch (err) {
      setError(err.response?.data?.mensaje || 'Error al enviar el código')
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="rc-wrap">
      <div className="rc-card">
        <div className="rc-header">
          <div className="rc-header-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </div>
          <div>
            <div className="rc-eyebrow">Seguridad</div>
            <div className="rc-title">Recuperar contraseña</div>
          </div>
        </div>

        <div className="rc-body">
          <div className="rc-steps">
            <div className="rc-step"><div className="rc-step-num active">1</div><span className="rc-step-lbl active">Teléfono</span></div>
            <div className="rc-step-line"></div>
            <div className="rc-step"><div className="rc-step-num pending">2</div><span className="rc-step-lbl">Código</span></div>
            <div className="rc-step-line"></div>
            <div className="rc-step"><div className="rc-step-num pending">3</div><span className="rc-step-lbl">Contraseña</span></div>
            <div className="rc-step-line"></div>
            <div className="rc-step"><div className="rc-step-num pending">4</div><span className="rc-step-lbl">Listo</span></div>
          </div>

          <h2 className="rc-form-title">Ingresa tu teléfono</h2>
          <p className="rc-form-sub">Te enviaremos un código de verificación al número que tienes registrado.</p>

          <div className="rc-field">
            <label>Número de teléfono</label>
            <input
              type="tel"
              placeholder="10 dígitos"
              maxLength={10}
              value={telefono}
              onChange={e => setTelefono(e.target.value.replace(/\D/g, ''))}
            />
          </div>

          {error && <p style={{ color: '#ef5350', fontSize: '13px', marginBottom: '12px' }}>{error}</p>}

          <div className="rc-info-box">
            <div className="rc-info-ic">
              <svg viewBox="0 0 12 12" fill="none">
                <circle cx="6" cy="6" r="5" stroke="white" strokeWidth="1.2"/>
                <line x1="6" y1="5" x2="6" y2="9" stroke="white" strokeWidth="1.4" strokeLinecap="round"/>
                <circle cx="6" cy="3.5" r="0.7" fill="white"/>
              </svg>
            </div>
            <p className="rc-info-txt">Si no tienes acceso al número registrado, contacta al administrador del sistema.</p>
          </div>

          <button className="rc-btn" onClick={handleEnviar} disabled={cargando}>
            {cargando ? 'Enviando...' : 'Enviar código'}
          </button>
          <p className="rc-link">¿Recordaste tu contraseña? <span onClick={() => navigate('/')}>Iniciar sesión</span></p>
        </div>
      </div>
    </div>
  )
}

export default RecuperarCuenta