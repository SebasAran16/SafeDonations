const { gql } = require("@apollo/client");

const GET_ACTIVE_DONEES = gql`
  {
    activeDonees(
      where: { donee_not: "0x000000000000000000000000000000000000dEaD" }
    ) {
      id
      doneeId
      donee
      cause
      message
    }
  }
`;

export default { GET_ACTIVE_DONEES };
