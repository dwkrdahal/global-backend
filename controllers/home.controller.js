class homeController {
  home = (req, res) => {
    // TODO: write end points for home page
    res.json({
      page: "home"
    })
  }
  
  about = (req, res) => {
    // TODO: write end points for about page
    res.json({
      page: "about"
    })
  }
  
  contact = (req, res) => {
    // TODO: write end points for contact page
    res.json({
      page: "contact"
    })
  }
}

export default homeController