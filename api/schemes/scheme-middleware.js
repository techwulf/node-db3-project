const db = require('../../data/db-config');

const checkSchemeId = async(req, res, next) => {
  const [schemeExists] = await db('schemes')
    .where('scheme_id', req.params.scheme_id);
  if (schemeExists) {
    next();
  } else {
    next({
      status: 404, 
      message: `scheme with scheme_id ${req.params.scheme_id} not found`
    });
  }
}

const validateScheme = (req, res, next) => {
  if (req.body.scheme_name && typeof(req.body.scheme_name) === 'string') {
    next();
  } else {
    next({status:400, message: 'invalid scheme_name'})
  }
}

const validateStep = (req, res, next) => {
  if(
    req.body.instructions &&
    typeof(req.body.instructions) === 'string' &&
    req.body.step_number &&
    typeof(req.body.step_number) === 'number' &&
    req.body.step_number > 0
  ) {
    next();
  } else {
    next({status: 400, message: 'invalid step'});
  }
}

module.exports = {
  checkSchemeId,
  validateScheme,
  validateStep,
}
