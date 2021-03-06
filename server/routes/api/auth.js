import User from '../../models/User.js'
import parseErrors from '../../utils/parseErrors.js'
import stripeApi from 'stripe'
const stripe = stripeApi(process.env.SECRET_KEY)

module.exports = app => {
  app.post('/api/signup', async (req, res, next) => {
    const { email, password } = req.body.user

    const customer = await stripe.customers.create({ email })
    console.log('await customer created by stripe:')
    console.log(customer)

    const user = new User({ email })

    user.stripe = customer.id

    user.setPassword(password)
    console.log('password set.')

    user.setVerificationToken()
    console.log('token set.')

    user
      .save()
      .then(user => {
        // sendConfirmationEmail(user)
        res.json({ user: user.toAuthJSON() })
      })
      .catch(err => {
        console.log(err)
        res.status(400).json({ errors: parseErrors(err.errors) })
      })
  })

  app.post('/api/login', (req, res, next) => {
    // takes credentials out of object
    const { credentials } = req.body

    console.log('hit login route')
    console.log(credentials)

    User.findOne({ email: credentials.email }).then(async user => {
      if (user && user.isValidPassword(credentials.password)) {
        if (user.stripe == undefined) {
          const customer = await stripe.customers.create({
            email: credentials.email
          })
          console.log('customer created:')
          console.log(customer)
          user.stripe = customer.id
          console.log('stripe property added:')
          console.log(user.stripe)

          user.save().then(user => {
            res.json({ user: user.toAuthJSON() })
          })
        } else {
          res.json({ user: user.toAuthJSON() })
        }
      } else {
        res.status(400).json({ errors: { global: 'Invalid credentials.' } })
      }
    })
  })
}
