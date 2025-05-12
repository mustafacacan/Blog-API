class Response {
  constructor(data = null, message = null) {
    (this.data = data), (this.message = message);
  }

  success(res) {
    return res.status(200).json({
      success: true,
      data: this.data,
      message: this.message ? this.message : "transaction successful",
    });
  }

  create(res) {
    return res.status(201).json({
      success: true,
      data: this.data,
      message: this.message ? this.message : "transaction successful",
    });
  }

  error400(res) {
    return res.status(400).json({
      succes: false,
      message: this.message ? this.message : "operation failed",
    });
  }

  error401(res) {
    return res.status(401).json({
      success: false,
      message: this.message ? this.message : "unauthorized access",
    });
  }

  error403(res) {
    return res.status(403).json({
      success: false,
      message: this.message ? this.message : "invalid error",
    });
  }

  err;

  error404(res) {
    return res.status(404).json({
      success: false,
      message: this.message ? this.message : "no record found",
    });
  }

  error422(res) {
    return res.status(422).json({
      success: false,
      message: this.message ? this.message : "invalid request",
    });
  }

  error500(res) {
    return res.status(500).json({
      success: false,
      message: this.message ? this.message : "server error",
    });
  }
}

module.exports = Response;
