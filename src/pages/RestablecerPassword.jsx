import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'
import './Recovery.css'

function EyeIcon({ open }) {
  return (
    <svg className="rc-eye-svg" viewBox="0 0 24 24">
      <path className="rc-eye-outer" d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle className="rc-eye-pupil" cx="12" cy="12" r={open ? 0 : 3}/>
      <line className="rc-eye-slash" x1="3" y1="3" x2="21" y2="21" style={{ opacity: open ? 1 : 0 }}/>
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <polyline points="2,6 5,9 10,3" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function RestablecerPassword() {
  const navigate = useNavigate()
  const [showPass1, setShowPass1] = useState(false)
  const [showPass2, setShowPass2] = useState(false)
  const [pass1, setPass1] = useState('')
  const [pass2, setPass2] = useState('')
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)
  const [strength, setStrength] = useState({
    level: 0, label: 'Ingresa tu contraseña', color: '#9abdc1'
  })

  const getLevel = (val) => {
    const hasLetter = /[a-zA-Z]/.test(val)
    const hasNumber = /[0-9]/.test(val)
    const hasSymbol = /[^a-zA-Z0-9]/.test(val)
    const long = val.length >= 8
    const combos = [hasLetter, hasNumber, hasSymbol].filter(Boolean).length
    if (val.length === 0) return 0
    if (!long || combos <= 1) return 1
    if (combos === 2) return 2
    return 3
  }

  const handlePass1 = (val) => {
    setPass1(val)
    const level = getLevel(val)
    const labels = [
      'Ingresa tu contraseña',
      'Débil — mínimo 8 caracteres con variedad',
      'Media — agrega símbolos para mayor seguridad',
      '¡Fuerte! Contraseña muy segura'
    ]
    const colors = ['#9abdc1', '#ef5350', '#ff9800', '#00BCD4']
    setStrength({ level, label: labels[level], color: colors[level] })
  }

  const barColor = (i) => {
    if (strength.level === 0) return '#e8f6f8'
    if (strength.level === 1) return i === 0 ? '#ef5350' : '#e8f6f8'
    if (strength.level === 2) return i <= 2 ? '#ff9800' : '#e8f6f8'
    return '#00BCD4'
  }

  const passwordsMatch = pass2.length > 0 && pass1 === pass2
  const passwordsMismatch = pass2.length > 0 && pass1 !== pass2
  const canSave = strength.level >= 1 && passwordsMatch

  const handleRestablecer = async () => {
    setError('')
    if (!canSave) {
      setError('Verifica que las contraseñas coincidan y sean seguras')
      return
    }

    const telefono = sessionStorage.getItem('recuperar_telefono')
    const codigo   = sessionStorage.getItem('recuperar_codigo')

    if (!telefono || !codigo) {
      navigate('/recuperar-cuenta')
      return
    }

    setCargando(true)
    try {
      await api.post('/auth/recuperar/restablecer', {
        telefono,
        codigo,
        nueva_contrasena: pass1
      })
      sessionStorage.removeItem('recuperar_telefono')
      sessionStorage.removeItem('recuperar_codigo')
      navigate('/password-actualizada')
    } catch (err) {
      setError(err.response?.data?.mensaje || 'Error al restablecer la contraseña')
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
            <div className="rc-eyebrow">Nueva contraseña</div>
            <div className="rc-title">Restablecer acceso</div>
          </div>
        </div>

        <div className="rc-body">
          <div className="rc-steps">
            <div className="rc-step"><div className="rc-step-num done"><CheckIcon/></div><span className="rc-step-lbl">Teléfono</span></div>
            <div className="rc-step-line done"></div>
            <div className="rc-step"><div className="rc-step-num done"><CheckIcon/></div><span className="rc-step-lbl">Código</span></div>
            <div className="rc-step-line done"></div>
            <div className="rc-step"><div className="rc-step-num active">3</div><span className="rc-step-lbl active">Contraseña</span></div>
            <div className="rc-step-line"></div>
            <div className="rc-step"><div className="rc-step-num pending">4</div><span className="rc-step-lbl">Listo</span></div>
          </div>

          <h2 className="rc-form-title">Nueva contraseña</h2>
          <p className="rc-form-sub">Elige una contraseña segura que no hayas usado antes.</p>

          <div className="rc-field">
            <label>Nueva contraseña</label>
            <div className="rc-input-wrap">
              <input
                type={showPass1 ? 'text' : 'password'}
                placeholder="Mínimo 8 caracteres"
                value={pass1}
                onChange={e => handlePass1(e.target.value)}
              />
              <button className="rc-eye-btn" onClick={() => setShowPass1(!showPass1)}>
                <EyeIcon open={showPass1}/>
              </button>
            </div>
            <div className="rc-strength-bars">
              {[0,1,2,3].map(i => (
                <div key={i} className="rc-strength-bar" style={{ background: barColor(i) }}/>
              ))}
            </div>
            <p className="rc-strength-lbl" style={{ color: strength.color }}>{strength.label}</p>
          </div>

          <div className="rc-field">
            <label>Confirmar contraseña</label>
            <div className="rc-input-wrap">
              <input
                type={showPass2 ? 'text' : 'password'}
                placeholder="Repite la contraseña"
                value={pass2}
                onChange={e => setPass2(e.target.value)}
              />
              <button className="rc-eye-btn" onClick={() => setShowPass2(!showPass2)}>
                <EyeIcon open={showPass2}/>
              </button>
            </div>
            {passwordsMatch   && <p style={{ color:'#00BCD4', fontSize:'12px', marginTop:'4px' }}>✓ Las contraseñas coinciden</p>}
            {passwordsMismatch && <p style={{ color:'#ef5350', fontSize:'12px', marginTop:'4px' }}>✗ Las contraseñas no coinciden</p>}
          </div>

          {error && <p style={{ color: '#ef5350', fontSize: '13px', marginBottom: '12px' }}>{error}</p>}

          <button className="rc-btn" onClick={handleRestablecer} disabled={!canSave || cargando}>
            {cargando ? 'Guardando...' : 'Guardar contraseña'}
          </button>
          <p className="rc-link"><span onClick={() => navigate('/verificar-codigo')}>← Volver</span></p>
        </div>
      </div>
    </div>
  )
}

export default RestablecerPassword