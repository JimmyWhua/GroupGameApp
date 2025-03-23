//! A simple program that takes a number `n` as input, and writes the `n-1`th and `n`th fibonacci
//! number as an output.

// These two lines are necessary for the program to properly compile.
//
// Under the hood, we wrap your main function with some extra code so that it behaves properly
// inside the zkVM.
#![no_main]
sp1_zkvm::entrypoint!(main);

use alloy_sol_types::SolType;
use textmatcher_lib::{textmatcher, PublicValuesStruct};
use sha2::{Digest, Sha256};

pub fn main() {
    // Read inputs
    let input_text = sp1_zkvm::io::read::<String>(); // User input text
    let target_text = sp1_zkvm::io::read::<String>(); // Target text to match

    // Compute SHA-256 hash of input text for proof verification
    let mut hasher = Sha256::new();
    hasher.update(input_text.as_bytes());
    let input_hash = hasher.finalize();

    // Perform text matching
    let result = textmatcher(input_text.clone(), target_text.clone());

    // Encode public values
    let bytes = PublicValuesStruct::abi_encode(&PublicValuesStruct {
        input_hash: input_hash.into(), // Convert to 32-byte array
        result,
    });

    // Commit to public values for the proof
    sp1_zkvm::io::commit_slice(&bytes);
}

