export const validate = (schema) => {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);

    if(!result.success) {
      return res.status(400).json({
        success : false,
        errors : result.error.flatten().fieldErrors,
      });
    }

    //rreplace nya yung req.body nang validate na data
    req.body = result.data;

    next();
    
  };
};

export const updateValidate = (schema) => {
  return (req, res, next) => {
    const result = schema.safeParse({params : req.params, body : req.body});

    if(!result.success) {
      return res.status(400).json({
        success : false,
        errors : result.error.flatten().fieldErrors,
      });
    }

    req.params = result.data.params;
    req.body = result.data.body;

    next();

  };
};