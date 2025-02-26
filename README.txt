
query HelloWorld {
  helloo
}

{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0b2tlbiBsb2dpbiIsImlzcyI6ImZyb20gc2VydmVyIiwiaWQiOiI3NjA5MTg0NC0wN2UxLTQ3MWEtOTQ1ZS1mM2VmMjFjNDYyY2IiLCJlbWFpbCI6InR1YW5hZG1pbkBnbWFpbC5jb20iLCJhdmF0YXIiOiJlcmhyZWhyaCIsImFkZHJlc3MiOiIxMjMgTGUgTG9pIEYzIFEuMSIsImlhdCI6MTc0MDM4NDA3NiwiZXhwIjoxODI2Nzg0MDc2fQ.gyy36W2Uh0xOTfYKTNC1v4GTgcV3A0VwEatXdgv67PA"
}

``````````
query Me {
  me {
    statusCode
    message
    error
    data {
      email
    }
  }
}
``````````
mutation RegisterUser($registerUserInput: RegisterUserInput!) {
  registerUser(registerUserInput: $registerUserInput) {
    statusCode
    message
    error
    data {
      email
      role
    }
  }
}
  {
    "registerUserInput": {
      "email": "tuanuser2@gmail.com",
      "password": "123456",
      "phone": "0977757900",
      "address": "123 Le Loi F3 Q.1",
      "avatar":"erhrehrh"
    }
  }

``````````
mutation RemoveUser($id: String!) {
  removeUser(id: $id) {
    statusCode
    message
    error
    data {
      email
      role
      isActive
      isDeleted
    }
  }
}
  {
    "id": "c2d57bb5-6d45-453e-afcc-87e2cca17c27"
  }

``````````
 mutation UpdateUser($id: String!, $updateUserInput: UpdateUserInput!) {
  updateUser(id: $id, updateUserInput: $updateUserInput) {
    statusCode
    message
    error
    data {
      email
      role
    }
  }
}
  {
    "id": "c2d57bb5-6d45-453e-afcc-87e2cca17c27",
    "updateUserInput": {
      "address": "1234 Le loi F3 Q.1"
    }
  }

``````````
query FindOneUser($id: String!) {
  findOneUser(id: $id) {
    statusCode
    message
    error
    data {
      email
      role
      isActive
      isDeleted
    }
  }
}
  {
    "id": "a745bcee-81da-4f9a-b2be-a86ddbc3dfd9"
  }
``````````
query FindAllUsers($qs: String!) {
  findAllUsers(qs: $qs) {
    statusCode
    message
    error
    data {
      total
      limit
      skip
      currentPage
      totalPages
      data {
        id
        email
        role
      }
    }
  }
}
  {
    "qs": "email=/tuanadmin/&skip=0&limit=10&sort=-1"
  }

``````````
query SearchTerms($filterDto: FilterDto!) {
  searchTerms(filterDto: $filterDto) {
		data {
      email
    }
    totalPages
    total
  }
}
  {
    "filterDto": {
      "s": "email=tuan&skip=0&limit=10&sort=-1"
    }
  }

``````````
query FindOne($id: String!) {
  findOne(id: $id) {
    email
    phone
    id
    address
  }
}
  {
    "id": "76091844-07e1-471a-945e-f3ef21c462cb"
  }