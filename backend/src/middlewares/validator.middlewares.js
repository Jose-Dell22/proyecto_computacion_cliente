export const validateSchema = (schema) => (req, res, next) => {
  try {

    schema.parse(req.body)

    next()

  } catch (error) {

    if (error.errors) {
      const errors = error.errors.map((err) => err.message)
      return res.status(400).json(errors)
    }

    return res.status(400).json({
      message: error.message
    })
  }
}