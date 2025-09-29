import React from 'react'
import Head from 'next/head'
import { useForm } from 'react-hook-form'

type FormValues = {
  fullName: string
  email: string
  address: string
  city: string
  postalCode: string
  cardNumber: string
  expiry: string
  cvc: string
}

const Checkout: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>()

  const onSubmit = (data: FormValues) => {
    // TODO: integrate payment gateway
    alert(`Order placed for ${data.fullName}`)
  }

  return (
    <>
      <Head>
        <title>Checkout | AGRI-HOPE</title>
        <meta name="description" content="Secure checkout for your farm-fresh products." />
      </Head>
      <main className="min-h-screen pt-24 pb-16">
        <div className="container-custom grid grid-cols-1 lg:grid-cols-3 gap-8">
          <form onSubmit={handleSubmit(onSubmit)} className="lg:col-span-2 card-glass p-6" aria-labelledby="payment-details">
            <h1 id="payment-details" className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">Payment details</h1>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium">Full name</label>
                <input id="fullName" className="input mt-1" {...register('fullName', { required: true })} aria-invalid={!!errors.fullName} />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium">Email</label>
                <input id="email" type="email" className="input mt-1" {...register('email', { required: true })} aria-invalid={!!errors.email} />
              </div>
              <div className="md:col-span-2">
                <label htmlFor="address" className="block text-sm font-medium">Address</label>
                <input id="address" className="input mt-1" {...register('address', { required: true })} aria-invalid={!!errors.address} />
              </div>
              <div>
                <label htmlFor="city" className="block text-sm font-medium">City</label>
                <input id="city" className="input mt-1" {...register('city', { required: true })} aria-invalid={!!errors.city} />
              </div>
              <div>
                <label htmlFor="postalCode" className="block text-sm font-medium">Postal Code</label>
                <input id="postalCode" className="input mt-1" {...register('postalCode', { required: true })} aria-invalid={!!errors.postalCode} />
              </div>
            </div>

            <h2 className="text-xl font-semibold mt-8">Card information</h2>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label htmlFor="cardNumber" className="block text-sm font-medium">Card number</label>
                <input id="cardNumber" inputMode="numeric" className="input mt-1" {...register('cardNumber', { required: true })} aria-invalid={!!errors.cardNumber} />
              </div>
              <div>
                <label htmlFor="expiry" className="block text-sm font-medium">Expiry</label>
                <input id="expiry" placeholder="MM/YY" className="input mt-1" {...register('expiry', { required: true })} aria-invalid={!!errors.expiry} />
              </div>
              <div>
                <label htmlFor="cvc" className="block text-sm font-medium">CVC</label>
                <input id="cvc" inputMode="numeric" className="input mt-1" {...register('cvc', { required: true })} aria-invalid={!!errors.cvc} />
              </div>
            </div>

            <button type="submit" className="btn btn-primary mt-8 w-full md:w-auto">Pay now</button>
          </form>

          <aside className="card-glass p-6" aria-labelledby="order-summary">
            <h2 id="order-summary" className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">Order summary</h2>
            <ul className="mt-4 space-y-4">
              <li className="flex items-center justify-between">
                <span>Subtotal</span>
                <span>$27.47</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Shipping</span>
                <span>$4.99</span>
              </li>
              <li className="flex items-center justify-between font-semibold border-t border-neutral-200 dark:border-neutral-700 pt-4">
                <span>Total</span>
                <span>$32.46</span>
              </li>
            </ul>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-4">All payments are securely processed. We never store your card details.</p>
          </aside>
        </div>
      </main>
    </>
  )
}

export default Checkout 