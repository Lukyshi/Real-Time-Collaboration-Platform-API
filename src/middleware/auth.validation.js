const validate = (schema) => {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);

    if(!result.success) {
      return res.status(404).json({
        succes : false,
        errors : result.error.flatter().fieldErrors,
      });
    }

    //rreplace nya yung req.body nang validate na data
    req.body = result.data;

    next();
    
  };
};

export default validate;