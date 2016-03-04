#Install Git Checkout:

1. Remove any version installed with pip
    `pip uninstall graphistry`
2. Install local git checkout
	`./setup.py develop`

#Uninstall Checkout:

	./setup.py develop --uninstall

#Release Procedure
1. Bump version number to X.X.X in setup.py
2. `git commit -a -m "Version X.X.X"`
3. `git tag X.X.X`
4. `git push`
5. 'git push --tags'

###Package & Upload:
1. Get ~/.pypirc file from the powers that be.
2. Run `./setup.py sdist upload -r pypi`