import { useNavigate } from 'react-router-dom'
import './Recovery.css'

function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <polyline points="2,6 5,9 10,3" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function PasswordActualizada() {
  const navigate = useNavigate()

  return (
    <div className="rc-wrap">
      <div className="rc-card">
        <div className="rc-header">
          <div className="rc-header-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
          <div>
            <div className="rc-eyebrow">Completado</div>
            <div className="rc-title">Contraseña actualizada</div>
          </div>
        </div>

        <div className="rc-body">
          <div className="rc-steps">
            <div className="rc-step"><div className="rc-step-num done"><CheckIcon/></div><span className="rc-step-lbl">Teléfono</span></div>
            <div className="rc-step-line done"></div>
            <div className="rc-step"><div className="rc-step-num done"><CheckIcon/></div><span className="rc-step-lbl">Código</span></div>
            <div className="rc-step-line done"></div>
            <div className="rc-step"><div className="rc-step-num done"><CheckIcon/></div><span className="rc-step-lbl">Contraseña</span></div>
            <div className="rc-step-line done"></div>
            <div className="rc-step"><div className="rc-step-num done"><CheckIcon/></div><span className="rc-step-lbl">Listo</span></div>
          </div>

          <div className="rc-success-wrap">
            <div className="rc-success-icon">
              <svg viewBox="0 0 34 34" fill="none">
                <polyline points="6,17 14,25 28,9" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="rc-success-title">¡Contraseña actualizada!</div>
            <p className="rc-success-desc">Tu contraseña fue restablecida con éxito. Ya puedes iniciar sesión con tu nueva contraseña.</p>
            <button className="rc-btn" onClick={() => navigate('/')}>Ir a iniciar sesión</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PasswordActualizada