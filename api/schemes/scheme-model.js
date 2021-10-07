const db = require('../../data/db-config');

function find() { 
  return db('schemes as sc')
    .leftJoin('steps as st', 'sc.scheme_id', 'st.scheme_id')
    .select(
      'sc.scheme_id', 
      'sc.scheme_name',
    )
    .count('st.scheme_id as number_of_steps')
    .groupBy('st.scheme_id')
    .orderBy('sc.scheme_id');
}

async function findById(scheme_id) { 
  const schemeSteps = await db('schemes as sc')
    .leftJoin('steps as st', 'sc.scheme_id', 'st.scheme_id')
    .select(
      'sc.scheme_id',
      'sc.scheme_name',
      'st.step_id',
      'st.step_number',
      'st.instructions'
    )
    .where('st.scheme_id', scheme_id)
    .orderBy('step_number');
  const schemesFormated = {
    scheme_id: parseInt(scheme_id),
    scheme_name: schemeSteps[0] ? schemeSteps[0].scheme_name:null,
    steps: 
      schemeSteps[0] 
        ? schemeSteps.map(scheme => {
          return {
            step_id: scheme.step_id,
            step_number: scheme.step_number,
            instructions: scheme.instructions
          };
        })
        : []
  };
  return schemesFormated;
}

function findSteps(scheme_id) { 
  return db('schemes as sc')
    .leftJoin('steps as st', 'sc.scheme_id', 'st.scheme_id')
    .select(
      'st.step_id',
      'st.step_number',
      'st.instructions',
      'sc.scheme_name'
    )
    .where('st.scheme_id', scheme_id)
    .orderBy('step_number');
}

async function add(scheme) { 
  const [newSchemeId] = await db('schemes').insert(scheme);
  return { scheme_id: newSchemeId, scheme_name: scheme.scheme_name };
}

async function addStep(scheme_id, step) { 
  await db('steps').insert({scheme_id, ...step});
  return findSteps(scheme_id);
}

module.exports = {
  find,
  findById,
  findSteps,
  add,
  addStep,
}
