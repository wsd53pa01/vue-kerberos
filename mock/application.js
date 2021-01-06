let data = [
  {
    id: 1,
    name: "Kerberos"
  },
  {
    id: 2,
    name: "EipApp"
  }
]

module.exports = [
  {
    url: "/application/",
    type: "get",
    response: _ => {
      return {
        isSuccess: true,
        code: 20000,
        data: data
      };
    }
  },

  {
    url: "/application/",
    type: "post",
    response: config => {
      const body = config.body
      body.id = Math.max(...data.map(x => x.id)) + 1
      data.push(body)
      return {
        isSuccess: true,
        code: 20000,
        data: body
      };
    }
  },

  {
    url: "/application/",
    type: "put",
    response: config => {
      const { id, name } = config.body

      data.find(x => x.id == id).name = name
      return {
        isSuccess: true,
        code: 20000,
        data: data
      };
    }
  },

  {
    url: "/application/",
    type: "delete",
    response: config => {
      const { id } = config.body

      data = data.filter(x => x.id != id)
      return {
        isSuccess: true,
        code: 20000,
        data: data
      };
    }
  },
];
