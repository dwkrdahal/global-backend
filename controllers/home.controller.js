class homeController {
  home = (req, res) => {
    res.json({
      page: "home"
    })
  }
  
  about = (req, res) => {
    res.json({
      page: "abpout"
    })
  }
  
  contact = (req, res) => {
    res.json({
      page: "contact"
    })
  }
}

export default homeController