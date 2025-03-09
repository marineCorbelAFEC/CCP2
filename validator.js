import Joi from 'joi';

const authSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string()
    .min(6)
    .required()
    .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
    .strip(),
});

const userSchema = Joi.object({
  name: Joi.string().min(3).max(100).required(),
  email: Joi.string().email().required(),
  password: Joi.string()
    .min(6)
    .required()
    .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
    .strip(),
});
// le .strip permet de ne pas faire apparaitre le mot de passe quand on utilise le schéma

const organizationSchema = Joi.object({
  name: Joi.string().min(3).max(100).required(),
  description: Joi.string().allow(null, '').max(500),
});

const missionSchema = Joi.object({
  title: Joi.string().min(3).max(100).required(),
  description: Joi.string().allow(null, '').max(500),
  date: Joi.date().iso().required(),
  organizationId: Joi.number().integer().positive().required(),
});

const applicationSchema = Joi.object({
  missionId: Joi.number().integer().positive().required(),
});

export {
  authSchema,
  userSchema,
  organizationSchema,
  missionSchema,
  applicationSchema,
};
