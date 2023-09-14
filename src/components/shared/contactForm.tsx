import React from 'react'

const contactForm: React.FC = () => {
  return (
    <form
      name="contact-form"
      action="/obrigado-contato"
      method="POST"
      data-netlify="true"
      data-netlify-honeypot="sou-um-robo"
    >
      <input
        type="hidden"
        className="hidden"
        name="form-name"
        value="contact-form"
      />
      <p className="form-field">
        <label htmlFor="fullname">Nome</label>
        <input
          id="fullname"
          name="fullname"
          type="text"
          placeholder="Nome"
          required
        />
      </p>
      <p className="sou-um-robo">
        <label htmlFor="sou-um-robo">Sou um robô</label>
        <input type="text" name="sou-um-robo" id="sou-um-robo" />
      </p>
      <p className="form-field">
        <label htmlFor="email">E-mail</label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="E-mail"
          required
        />
      </p>
      {/* honeypot field */}
      <p className="hidden">
        <label htmlFor="secondary-email">E-mail</label>
        <input
          id="secondary-email"
          name="secondary-email"
          type="secondary-email"
          placeholder="E-mail"
        />
      </p>
      <p className="form-field">
        <label htmlFor="message">Mensagem</label>
        <textarea id="message" name="message" placeholder="Mensagem" required />
      </p>
      <div className="flex items-center justify-between">
        <button className="btn btn--primary" type="submit" value="Enviar">
          Enviar
        </button>
      </div>
    </form>
  )
}

export default contactForm
