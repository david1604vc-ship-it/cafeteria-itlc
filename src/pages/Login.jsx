import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'
import './Login.css'

function Login() {
  const [tab, setTab] = useState('login')
  const [showPass1, setShowPass1] = useState(false)
  const [showPass2, setShowPass2] = useState(false)
  const [showPass3, setShowPass3] = useState(false)
  const navigate = useNavigate()

  // Login
  const [telefono, setTelefono] = useState('')
  const [password, setPassword] = useState('')
  const [errorLogin, setErrorLogin] = useState('')
  const [loadingLogin, setLoadingLogin] = useState(false)

  // Registro
  const [regNombre, setRegNombre] = useState('')
  const [regApellido, setRegApellido] = useState('')
  const [regTelefono, setRegTelefono] = useState('')
  const [regPassword, setRegPassword] = useState('')
  const [regConfirm, setRegConfirm] = useState('')
  const [errorReg, setErrorReg] = useState('')
  const [loadingReg, setLoadingReg] = useState(false)

  const handleLogin = async () => {
    if (!telefono || !password) {
      setErrorLogin('Por favor completa todos los campos')
      return
    }
    setLoadingLogin(true)
    setErrorLogin('')
    try {
      const res = await api.post('/auth/login', {
        telefono,
        contrasena: password
      })
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('usuario', JSON.stringify(res.data.usuario))

      if (res.data.usuario.rol === 'administrador') {
        navigate('/admin')
      } else {
        navigate('/home')
      }
    } catch (err) {
      setErrorLogin(err.response?.data?.mensaje || 'Error al iniciar sesión')
    } finally {
      setLoadingLogin(false)
    }
  }

  const handleRegistro = async () => {
    if (!regNombre || !regApellido || !regTelefono || !regPassword || !regConfirm) {
      setErrorReg('Por favor completa todos los campos')
      return
    }
    if (regPassword !== regConfirm) {
      setErrorReg('Las contraseñas no coinciden')
      return
    }
    if (regPassword.length < 8) {
      setErrorReg('La contraseña debe tener mínimo 8 caracteres')
      return
    }
    setLoadingReg(true)
    setErrorReg('')
    try {
      await api.post('/auth/registro', {
        nombre:     regNombre,
        apellido:   regApellido,
        telefono:   regTelefono,
        contrasena: regPassword
      })
      setTab('login')
      setTelefono(regTelefono)
      setErrorLogin('¡Cuenta creada! Ya puedes iniciar sesión.')
    } catch (err) {
      setErrorReg(err.response?.data?.mensaje || 'Error al crear la cuenta')
    } finally {
      setLoadingReg(false)
    }
  }

  const EyeIcon = ({ open }) => (
    <svg className="rc-eye-svg" viewBox="0 0 24 24">
      <path className="eye-outer" d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle className="eye-pupil" cx="12" cy="12" r={open ? 0 : 3}/>
      <line className="eye-slash" x1="3" y1="3" x2="21" y2="21" style={{opacity: open ? 1 : 0}}/>
    </svg>
  )

  return (
    <div className="auth-wrapper">
      <div className="auth-card">

        <div className="auth-tabs">
          <button className={tab === 'login' ? 'active' : ''} onClick={() => { setTab('login'); setErrorLogin(''); }}>
            Iniciar sesión
          </button>
          <button className={tab === 'signup' ? 'active' : ''} onClick={() => { setTab('signup'); setErrorReg(''); }}>
            Crear cuenta
          </button>
        </div>

        <div className="auth-body">

          {/* Panel izquierdo */}
          <div className="auth-left">
            <div className="left-inner">
              <div className="logo-ring">☕</div>
              <div className="brand-name">Cafetería 2</div>
              <div className="brand-sub">ITLC</div>
              <div className="orn"><span></span><i>✦</i><span></span></div>
              <p className="left-desc">
                {tab === 'login'
                  ? 'Bienvenido de vuelta. Tu comida favorita, lista en minutos.'
                  : 'Crea tu cuenta y empieza a disfrutar de la cafetería ITLC.'}
              </p>
            </div>
          </div>

          {/* LOGIN */}
          {tab === 'login' ? (
            <div className="auth-right anim" key="login">
              <div className="eyebrow">Acceso</div>
              <h2 className="form-title">Bienvenido</h2>
              <p className="form-sub">Ingresa tus datos para continuar</p>

              <div className="field">
                <label>Número de teléfono</label>
                <input
                  type="tel"
                  placeholder="55 1234 5678"
                  value={telefono}
                  onChange={e => setTelefono(e.target.value)}
                />
              </div>

              <div className="field">
                <label>Contraseña</label>
                <div className="pass-wrap">
                  <input
                    type={showPass1 ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleLogin()}
                  />
                  <button className="eye-btn" type="button" onClick={() => setShowPass1(!showPass1)}>
                    <EyeIcon open={showPass1}/>
                  </button>
                </div>
              </div>

              {errorLogin && (
                <p style={{
                  color: errorLogin.includes('creada') ? '#00BCD4' : '#ef5350',
                  fontSize: '12px',
                  textAlign: 'center',
                  marginBottom: '8px'
                }}>
                  {errorLogin}
                </p>
              )}

              <p className="forgot" onClick={() => navigate('/recuperar-cuenta')}>
                ¿Olvidaste tu contraseña?
              </p>

              <button
                className="btn-main"
                onClick={handleLogin}
                disabled={loadingLogin}
                style={{opacity: loadingLogin ? 0.7 : 1}}
              >
                {loadingLogin ? 'Entrando...' : 'Entrar'}
              </button>

              <p className="link-text">
                ¿No tienes cuenta? <span onClick={() => setTab('signup')}>Regístrate aquí</span>
              </p>
            </div>

          ) : (

          /* SIGNUP */
            <div className="auth-right anim" key="signup">
              <div className="eyebrow">Registro</div>
              <h2 className="form-title">Únete ahora</h2>
              <p className="form-sub">Crea tu cuenta y empieza a disfrutar</p>

              <div className="row2">
                <div className="field">
                  <label>Nombre</label>
                  <input
                    type="text"
                    placeholder="Juan"
                    value={regNombre}
                    onChange={e => setRegNombre(e.target.value)}
                  />
                </div>
                <div className="field">
                  <label>Apellido</label>
                  <input
                    type="text"
                    placeholder="Pérez"
                    value={regApellido}
                    onChange={e => setRegApellido(e.target.value)}
                  />
                </div>
              </div>

              <div className="field">
                <label>Número de teléfono</label>
                <input
                  type="tel"
                  placeholder="55 1234 5678"
                  value={regTelefono}
                  onChange={e => setRegTelefono(e.target.value)}
                />
              </div>

              <div className="field">
                <label>Contraseña</label>
                <div className="pass-wrap">
                  <input
                    type={showPass2 ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={regPassword}
                    onChange={e => setRegPassword(e.target.value)}
                  />
                  <button className="eye-btn" type="button" onClick={() => setShowPass2(!showPass2)}>
                    <EyeIcon open={showPass2}/>
                  </button>
                </div>
              </div>

              <div className="field">
                <label>Confirmar contraseña</label>
                <div className="pass-wrap">
                  <input
                    type={showPass3 ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={regConfirm}
                    onChange={e => setRegConfirm(e.target.value)}
                    className={
                      regConfirm.length > 0
                        ? regPassword === regConfirm ? 'rc-input-success' : 'rc-input-error'
                        : ''
                    }
                  />
                  <button className="eye-btn" type="button" onClick={() => setShowPass3(!showPass3)}>
                    <EyeIcon open={showPass3}/>
                  </button>
                </div>
                {regConfirm.length > 0 && regPassword !== regConfirm && (
                  <p style={{color:'#ef5350', fontSize:'11px', marginTop:'5px'}}>✗ Las contraseñas no coinciden</p>
                )}
                {regConfirm.length > 0 && regPassword === regConfirm && (
                  <p style={{color:'#00BCD4', fontSize:'11px', marginTop:'5px'}}>✓ Las contraseñas coinciden</p>
                )}
              </div>

              {errorReg && (
                <p style={{color:'#ef5350', fontSize:'12px', textAlign:'center', marginBottom:'8px'}}>
                  {errorReg}
                </p>
              )}

              <button
                className="btn-main"
                onClick={handleRegistro}
                disabled={loadingReg}
                style={{opacity: loadingReg ? 0.7 : 1}}
              >
                {loadingReg ? 'Creando cuenta...' : 'Crear cuenta'}
              </button>

              <p className="link-text">
                ¿Ya tienes cuenta? <span onClick={() => setTab('login')}>Inicia sesión</span>
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

export default Login