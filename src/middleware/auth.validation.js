const validate = (schema) => {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);

    if(!result.success) {
      return res.status(404).json({
        succes : false,
        errors : result.error.flatten().fieldErrors,
      });
    }

    //rreplace nya yung req.body nang validate na data
    req.body = result.data;

    next();
    
  };
};

export default validate;