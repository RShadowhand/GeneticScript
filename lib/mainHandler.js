var defaultGeneLength = 64;

var FitnessCalc = {
	solution: new Array(64),
	setSolution: function(newSolution){
		this.solution = newSolution.split("");
	},
	getFitness: function(indiv){
		var fitness = 0;
		for(var i = 0; i < indiv.size() && i < this.solution.length; i++){
			if(indiv.getGene(i) == this.solution[i]){
				fitness++;
			}
		}
		return fitness;
	},
	getMaxFitness: function(){
		return this.solution.length;
	}
};{
	FitnessCalc.solution = "1111111111111111111111111111111111111111111111111111111111111111".split("");
}

var Algorithm = {
    uniformRate: 0.5, 
    mutationRate: 0.015,
    tournamentSize: 5,
    elitism: true,
    evolvePopulation: function(pop) {
        var newPopulation = new Population(pop.size(), false);

        // Keep our best individual
        if (this.elitism) {
            newPopulation.saveIndividual(0, pop.getFittest());
        }

        // Crossover population
        var elitismOffset;
        if (this.elitism) {
            elitismOffset = 1;
        } else {
            elitismOffset = 0;
        }
        // Loop over the population size and create new individuals with
        // crossover
        for (var i = elitismOffset; i < pop.size(); i++) {
            var indiv1 = this.tournamentSelection(pop);
            var indiv2 = this.tournamentSelection(pop);
            var newIndiv = this.crossover(indiv1, indiv2);
            newPopulation.saveIndividual(i, newIndiv);
        }

        // Mutate population
        for (var i = elitismOffset; i < newPopulation.size(); i++) {
            this.mutate(newPopulation.getIndividual(i));
        }

        return newPopulation;
    },
    crossover2: function(indiv1, indiv2) {
        var newSol = new Individual();
        // Loop through genes
        for (var i = 0; i < indiv1.size(); i++) {
            // Crossover
            if (Math.random() <= this.uniformRate) {
                newSol.setGene(i, indiv1.getGene(i));
            } else {
                newSol.setGene(i, indiv2.getGene(i));
            }
        }
        return newSol;
    },
	crossover: function(indiv1, indiv2) {
        var newSol = new Individual();
        // Loop through genes
		var spliceLoc = Math.round(Math.random()*64);
		for(var i = 0; i < indiv1.size(); i++){
			if(i <= spliceLoc){
				newSol.setGene(i, indiv1.getGene(i));
			}
			else{
				newSol.setGene(i, indiv2.getGene(i));
			}
		}
        
		
        return newSol;
    },
    mutate: function(indiv) {
        // Loop through genes
        for (var i = 0; i < indiv.size(); i++) {
            if (Math.random() <= this.mutationRate) {
                // Create random gene
                indiv.setGene(i, Math.round(Math.random()));
            }
        }
    },
    tournamentSelection: function(pop) {
        var tournament = new Population(this.tournamentSize, false);
        // For each place in the tournament get a random individual
        for (var i = 0; i < this.tournamentSize; i++) {
            var randomId = (Math.random() * pop.size());
            tournament.saveIndividual(i, pop.getIndividual(randomId));
        }
        // Get the fittest
        var fittest = tournament.getFittest();
        return fittest;
    }
}


function Population(popSize, init){
	this.individuals = new Array(popSize);
	
	if(init){
		for(var i = 0; i < popSize; i++){
			this.individuals[i] = new Individual(defaultGeneLength);
		}	
	}
	
	this.getFittest = function(){
		var fittest = this.individuals[0];
		
		for(var i = 0; i < this.individuals.length; i++){
			if(fittest.getFitness() <= this.individuals[i].getFitness()){
				fittest = this.individuals[i];
			}
		}
		
		return fittest;
	}
	
	this.saveIndividual = function(index, indiv){
		this.individuals[index] = indiv;
	}
	
	this.size = function(){
		this.individuals.length;
	}
}


function Individual(geneLength) {
	this.gene = new Array(geneLength);
	this.fitness = 0;
	
	for(var i = 0; i < this.gene.length; i++){
		this.gene[i] = Math.round(Math.random());
	}
	
	this.getGene = function(index){
		return this.gene[index];
	}
	
	this.setGene = function(index, val){
		this.gene[index] = val;
	}
	
    this.getFitness = function() {
        if (this.fitness == 0) {
            this.fitness = FitnessCalc.getFitness(this);
        }
        return this.fitness;
    }
	
	this.toString = function() {
        return this.gene.join("");
    }
	
	this.size = function(){
		return this.gene.length;
	}
}

var init = function(limit){
	this.limit = limit ? limit-1 : 19;
	var myPop = new Population(50, true);
	var b = document.getElementsByTagName("body")[0];
	b.append = function(a){this.innerHTML += a;}
	// Evolve our population until we reach an optimum solution
	var generationCount = 0;
	while (myPop.getFittest().getFitness() < FitnessCalc.getMaxFitness()) {
		console.log("Generation: " + generationCount + " Fittest: " + myPop.getFittest().getFitness());
		myPop = Algorithm.evolvePopulation(myPop);
		if(generationCount > this.limit) break;
		generationCount++;
	}
	console.log("Solution found!");
	console.log("Generation: " + generationCount);
	console.log("Genes :"+myPop.getFittest().toString());
	console.log("Target:"+FitnessCalc.solution.join(""));
	//console.log(myPop.getFittest());
}
