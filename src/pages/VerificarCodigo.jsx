import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'
import './Recovery.css'

function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <polyline points="2,6 5,9 10,3" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function VerificarCodigo() {
  const navigate = useNavigate()
  const inputs = useRef([])
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)

  const handleInput = (e, i) => {
    if (e.target.value.length === 1 && i < 5) {
      inputs.current[i + 1].focus()
    }
  }

  const handleKeyDown = (e, i) => {
    if (e.key === 'Backspace' && !e.target.value && i > 0) {
      inputs.current[i - 1].focus()
    }
  }

  const getCodigo = () => inputs.current.map(i => i.value).join('')

  const handleVerificar = async () => {
    setError('')
    const codigo = getCodigo()
    const telefono = sessionStorage.getItem('recuperar_telefono')

    if (codigo.length !== 6) {
      setError('Ingresa los 6 dígitos del código')
      return
    }
    if (!telefono) {
      navigate('/recuperar-cuenta')
      return
    }

    setCargando(true)
    try {
      await api.post('/auth/recuperar/verificar', { telefono, codigo })
      sessionStorage.setItem('recuperar_codigo', codigo)
      navigate('/restablecer-password')
    } catch (err) {
      setError(err.response?.data?.mensaje || 'Código inválido o expirado')
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
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.8 19.8 0 0 1 1.63 3.38 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6.06 6.06l.98-.93a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
            </svg>
          </div>
          <div>
            <div className="rc-eyebrow">Verificación</div>
            <div className="rc-title">Ingresa el código</div>
          </div>
        </div>

        <div className="rc-body">
          <div className="rc-steps">
            <div className="rc-step"><div className="rc-step-num done"><CheckIcon/></div><span className="rc-step-lbl">Teléfono</span></div>
            <div className="rc-step-line done"></div>
            <div className="rc-step"><div className="rc-step-num active">2</div><span className="rc-step-lbl active">Código</span></div>
            <div className="rc-step-line"></div>
            <div className="rc-step"><div className="rc-step-num pending">3</div><span className="rc-step-lbl">Contraseña</span></div>
            <div className="rc-step-line"></div>
            <div className="rc-step"><div className="rc-step-num pending">4</div><span className="rc-step-lbl">Listo</span></div>
          </div>

          <h2 className="rc-form-title">Código de verificación</h2>
          <p className="rc-form-sub">Enviamos 6 dígitos a tu número registrado. Vigencia: 5 minutos.</p>

          <div className="rc-field">
            <label>Código</label>
            <div className="rc-code-wrap">
              {[0,1,2,3,4,5].map(i => (
                <input
                  key={i}
                  className="rc-code-input"
                  type="text"
                  maxLength={1}
                  inputMode="numeric"
                  ref={el => inputs.current[i] = el}
                  onInput={e => handleInput(e, i)}
                  onKeyDown={e => handleKeyDown(e, i)}
                />
              ))}
            </div>
          </div>

          {error && <p style={{ color: '#ef5350', fontSize: '13px', marginBottom: '12px' }}>{error}</p>}

          <button className="rc-btn" onClick={handleVerificar} disabled={cargando}>
            {cargando ? 'Verificando...' : 'Verificar código'}
          </button>
          <p className="rc-link"><span onClick={() => navigate('/recuperar-cuenta')}>← Volver</span></p>
        </div>
      </div>
    </div>
  )
}

export default VerificarCodigo