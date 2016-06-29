declare namespace ai {
	interface FirstAndLastDOW {
		fdow: Date;
		ldow: Date;
	}
}

declare module "appInterface" {
    export = ai;
}
