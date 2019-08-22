let crypto;
try {
  crypto = require('crypto');
} catch (err) {
  console.log('crypto support is disabled!');
}

const MUTATION_CHANCE = 1;
const MUTATION_STRENGTH = 0.2;

var breed_dictionary = {};

class Strain {
  constructor({thc, cbd}) {
    this.thc = thc;
    this.cbd = cbd;
    breed_dictionary[this.id()] ? breed_dictionary[this.id()]++ : breed_dictionary[this.id()] = 1
    // console.log(breed_dictionary);
  }

  get thc_intensity() {
    if (this.thc.length > 1) {
      return this.thc.find(gene => gene.dominant).intensity
    } else {
      return this.thc[0].intensity
    }
  }

  get cbd_intensity() {
    if (this.cbd.length > 1) {
      return this.cbd.find(gene => gene.dominant).intensity
    } else {
      return this.cbd[0].intensity
    }
  }

  id() {
    let hash = crypto.createHash('sha256')
    hash.write(JSON.stringify(this))
    return hash.digest("hex")
  }

  toString() {
    return `thc: ${this.thc_intensity}, cbd: ${this.cbd_intensity}`
  }
}

class Breeder {
  // Strain, Strain => Strain
  static breed(strain_1, strain_2) {
    const child_attrs = Object.keys(strain_1).reduce((attrs, attr) => {
      attrs[attr] = {};
      
      // for each attribute, randomly choose a gene from each parent
      const strain_1_inherited_gene = this.getRandomItem(strain_1[attr]);
      const strain_2_inherited_gene = this.getRandomItem(strain_2[attr]);

      if (strain_1_inherited_gene.dominant && strain_2_inherited_gene.dominant) {
        // if both inherited genes are dominant, the child's gene will be too
        // in this case, average the intensity of each parent's gene
        let inherited_intensity = Math.floor((strain_1_inherited_gene['intensity'] + strain_2_inherited_gene['intensity']) / 2);
        attrs[attr] = [
          {intensity: inherited_intensity, dominant: true}
        ]
      } else if (!strain_1_inherited_gene.dominant && !strain_2_inherited_gene.dominant) {
        // if both inherited genes are recessive, the child's gene will be too
        // in this case, average the intensity of each parent's gene
        let inherited_intensity = Math.floor((strain_1_inherited_gene['intensity'] + strain_2_inherited_gene['intensity']) / 2);
        attrs[attr] = [
          {intensity: inherited_intensity, dominant: false}
        ]
      } else {
        // if one inherited gene is dominant and the other is recessive
        // those heterozygous genes will be passed on directly
        attrs[attr] = [
          JSON.parse(JSON.stringify(strain_1_inherited_gene)),
          JSON.parse(JSON.stringify(strain_2_inherited_gene))
        ].sort((a, b) => b.dominant - a.dominant)
      }
      return attrs;
    }, {});
    // roll for a chance at gene mutation
    if (Math.random() < MUTATION_CHANCE) {
      // mutate gene(s) and create a new mutant strain if roll is successful
      return new Strain(this.mutate(child_attrs));
    }
    // if roll fails, leave attriutes as is
    return new Strain(child_attrs);
  }

  static mutate(attrs) {
    // choose a random attribute
    const mutant_attr = this.getRandomItem(Object.keys(attrs));
    // choose a random gene from that attribute
    const current_attr_gene = this.getRandomItem(attrs[mutant_attr]);
    // determine how much to mutate the intensity
    const mutation_amount = this.mutation_amount(current_attr_gene.intensity);
    // mutate the intensity in that gene
    current_attr_gene.intensity = current_attr_gene.intensity + mutation_amount;
    return attrs;
  }

  static getRandomItem(e) { return e[Math.floor(Math.random() * e.length)] }

  static mutation_amount(current_value) {
    // calculate how much to mutate the value
    const absolute_mutation = current_value * MUTATION_STRENGTH;
    // roll whether the mutation will go up or down by this amount
    if (Math.random() < 0.5) {
      return -(Math.floor(absolute_mutation));
    }
    return Math.ceil(absolute_mutation);
  }
}

let thc_starter = new Strain({
  thc: [{intensity: 10, dominant: true}, {intensity: 12, dominant: false}],
  cbd: [{intensity: 5, dominant: true}]
})

let cbd_starter = new Strain({
  thc: [{intensity: 5, dominant: true}],
  cbd: [{intensity: 10, dominant: true}, {intensity: 12, dominant: false}]
})

let mix = Breeder.breed(thc_starter, cbd_starter);

debugger;
