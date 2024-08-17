const roleMiddleware = (roles) => {
    return (req, res, next) => {
      const userrole=req.user.role
      const hashrole=roles.some(role=>userrole.includes(role))
      if(!hashrole){
        return res.status(403).json({ message: 'Access Denied' });
      }
      next();
    };
  };
  
  module.exports = roleMiddleware;
  