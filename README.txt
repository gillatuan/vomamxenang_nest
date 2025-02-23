
query HelloWorld {
  helloo
}

{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0b2tlbiBsb2dpbiIsImlzcyI6ImZyb20gc2VydmVyIiwiaWQiOiI3NjA5MTg0NC0wN2UxLTQ3MWEtOTQ1ZS1mM2VmMjFjNDYyY2IiLCJlbWFpbCI6InR1YW5hZG1pbkBnbWFpbC5jb20iLCJhdmF0YXIiOiJlcmhyZWhyaCIsImFkZHJlc3MiOiIxMjMgTGUgTG9pIEYzIFEuMSIsImlhdCI6MTczOTg1MTUxNiwiZXhwIjoxODI2MjUxNTE2fQ.dKMajrFSoo4SAexlJ7XH8Ni2YRx11dV9JjLLU4nMOtc"
}

``````````
mutation {
  registerUser(registerUserInput: RegisterUserInput!) {
    email
    role
  }
}
  {
    "registerUserInput": {
      email: "tuanuser2@gmail.com",
      password: "123456",
      phone: "0977757900",
      address: "123 Le Loi F3 Q.1",
      avatar:"erhrehrh"
    }
  }

``````````
query ListUsers($qs: String) {
  listUsers(qs: $qs) {
    data {
    	id
      email
    }
    totalPages
    total
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

``````````
mutation RemoveUser($id: String!) {
  removeUser(id: $id) 
}
  {
    "id": "f474f6e2-27ed-4650-9a1c-7ba796637d22"
  }

``````````
mutation UpdateUser($id: String!, $updateUserInput: UpdateUserInput!) {
  updateUser(id: $id, updateUserInput: $updateUserInput) {
    email
  }
}
  {
    "id": "c2d57bb5-6d45-453e-afcc-87e2cca17c27",
    "updateUserInput": {
      "address": "1234 Le loi F3 Q.1"
    }
  }