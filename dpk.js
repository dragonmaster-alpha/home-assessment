const crypto = require("crypto");

// Create the function which is used for multiple times:
const createHash = (data) => crypto.createHash("sha3-512").update(data).digest("hex");

const getPartitionKey = (event) => {
  if (!event) {
      return null;
  }

  return event?.partitionKey ? event.partitionKey : event;
};

exports.deterministicPartitionKey = (event) => {
  const TRIVIAL_PARTITION_KEY = "0";
  const MAX_PARTITION_KEY_LENGTH = 256;
  const partitionKey = getPartitionKey(event);

  if (!partitionKey) {
      return TRIVIAL_PARTITION_KEY;
  }

  if (
      typeof partitionKey === "string" &&
      partitionKey.length < MAX_PARTITION_KEY_LENGTH
  ) {
      return partitionKey;
  }

  const data =
      typeof partitionKey === "object"
          ? JSON.stringify(partitionKey)
          : partitionKey;

  return createHash(data);
};



















// Code To Be Refactored:
// exports.deterministicPartitionKeyTest = (event) => {
//   const TRIVIAL_PARTITION_KEY = "0";
//   const MAX_PARTITION_KEY_LENGTH = 256;
//   let candidate;

//   if (event) {
//     if (event.partitionKey) {
//       candidate = event.partitionKey;
//     } else {
//       const data = JSON.stringify(event);
//       candidate = crypto.createHash("sha3-512").update(data).digest("hex");
//     }
//   }

//   if (candidate) {
//     if (typeof candidate !== "string") {
//       candidate = JSON.stringify(candidate);
//     }
//   } else {
//     candidate = TRIVIAL_PARTITION_KEY;
//   }
//   if (candidate.length > MAX_PARTITION_KEY_LENGTH) {
//     candidate = crypto.createHash("sha3-512").update(candidate).digest("hex");
//   }
//   return candidate;
// };