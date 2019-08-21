let crypto;
try {
  crypto = require('crypto');
} catch (err) {
  console.log('crypto support is disabled!');
}

const MUTATION_CHANCE = 0.2;
const MUTATION_STRENGTH = 0.2;

var breed_dictionary = {};

class Strain {
  constructor({thc, cbd}) {
    this.thc = thc;
    this.cbd = cbd;
    breed_dictionary[this.id()] ? breed_dictionary[this.id()]++ : breed_dictionary[this.id()] = 1
    console.log(breed_dictionary);
  }

  id() {
    let hash = crypto.createHash('sha256')
    hash.write(JSON.stringify(this))
    return hash.digest("hex")
  }
}

class Breeder {
  // Strain, Strain => Strain
  static breed(strain_1, strain_2) {
    const child_attrs = Object.keys(strain_1).reduce((attrs, compound) => {
      attrs[compound] = Math.floor((strain_1[compound] + strain_2[compound]) / 2);
      return attrs;
    }, {});
    if (Math.random() < MUTATION_CHANCE) {
      return new Strain(this.mutate(child_attrs));
    }
    return new Strain(child_attrs);
  }

  static mutate(attrs) {
    const mutant_attr = this.getRandomItem(Object.keys(attrs));
    const current_attr_value = attrs[mutant_attr];
    const mutation_amount = this.mutation_amount(current_attr_value);
    attrs[mutant_attr] = attrs[mutant_attr] + mutation_amount;
    return attrs;
  }

  static getRandomItem(e) { return e[Math.floor(Math.random() * e.length)] }

  static mutation_amount(current_value) {
    const absolute_mutation = current_value * MUTATION_STRENGTH;
    if (Math.random() < 0.5) {
      return -(Math.floor(absolute_mutation));
    }
    return Math.ceil(absolute_mutation);
  }
}

let thc_starter = new Strain({thc: 10, cbd: 5})

let cbd_starter = new Strain({thc: 5, cbd: 10})

let mix = Breeder.breed(thc_starter, cbd_starter);

debugger;
