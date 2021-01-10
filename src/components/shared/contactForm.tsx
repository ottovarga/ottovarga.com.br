import React, { useEffect, useState } from 'react'
import { useFormik } from 'formik'
import axios from 'axios'

const contactForm: React.FC = () => {
  const [isSuccessMessage, setIsSuccessMessage] = useState(false) // manage is success message state
  const [messageSent, setMessageSent] = useState(false) // manage sent message state
  const siteUrl = 'https://admin.gustavo.lwtf'

  const { handleChange, isSubmitting, values, handleSubmit } = useFormik({
    initialValues: {
      fullname: '',
      email: '',
      message: '',
      honeypot: ''
    },
    onSubmit: (
      { fullname, email, message, honeypot },
      { setSubmitting, resetForm }
    ) => {
      if (honeypot.length > 0) {
        setMessageSent(true)
        setIsSuccessMessage(true)
        return
      }

      setSubmitting(true)

      const bodyFormData = new FormData()
      bodyFormData.set('fullname', fullname)
      bodyFormData.set('email', email)
      bodyFormData.set('message', message)

      axios({
        method: 'post',
        url: `${siteUrl}/wp-json/contact-form-7/v1/contact-forms/13/feedback`,
        data: bodyFormData,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
        .then(response => {
          // actions taken when submission goes OK
          resetForm()
          setSubmitting(false)
          setMessageSent(true)
          setIsSuccessMessage(true)
        })
        .catch(error => {
          // actions taken when submission goes wrong
          setSubmitting(false)
          setMessageSent(true)
          setIsSuccessMessage(false)
        })
    }
  })

  return (
    <form onSubmit={handleSubmit}>
      <p className="form-field">
        <label htmlFor="fullname">Nome</label>
        <input
          id="fullname"
          name="fullname"
          type="text"
          placeholder="Nome"
          onChange={handleChange}
          value={values.fullname}
          required
        />
      </p>
      <p className="form-field">
        <label htmlFor="email">E-mail</label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="E-mail"
          onChange={handleChange}
          value={values.email}
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
          onChange={handleChange}
          value={values.honeypot}
        />
      </p>
      <p className="form-field">
        <label htmlFor="message">Mensagem</label>
        <textarea
          id="message"
          name="message"
          placeholder="Mensagem"
          onChange={handleChange}
          value={values.message}
          required
        />
      </p>
      <div className="flex items-center justify-between">
        <button
          className="btn btn--primary"
          type="submit"
          value="Enviar"
          disabled={isSubmitting}
        >
          Enviar
        </button>
        {isSubmitting && (
          <div className="lds-ripple">
            <div></div>
            <div></div>
          </div>
        )}
      </div>

      {messageSent && isSuccessMessage && (
        <div className="my-4">Messagm enviada com sucesso!</div>
      )}
      {messageSent && !isSuccessMessage && (
        <div className="my-4">Oops! Parece que tem algo errado aí...</div>
      )}
    </form>
  )
}

export default contactForm
