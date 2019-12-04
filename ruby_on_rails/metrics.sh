# Check if directory has a Gemfile
if ! ls Gemfile > /dev/null  ; then
  echo "Project is not a Ruby On Rails project"
  exit
fi

# bundle install
echo "Running bundle install to calculate number of dependencies..."
bundle_output=$(bundle install | tee /dev/tty)
direct_dependencies=$(echo "${bundle_output}" | grep "Bundle complete" | cut -d " " -f3)
total_dependencies=$(echo "${bundle_output}" | grep "Bundle complete" | cut -d " " -f6)
indirect_dependencies=$((total_dependencies - direct_dependencies))

# rspec
echo "Running tests to generate coverage report..."
rspec_output=$(bundle exec rspec spec | tee /dev/tty)
code_coverage=$(echo "${rspec_output}" | grep "Coverage report" | cut -d "(" -f2 | cut -d "%" -f1)

# rubycritic
echo "Running rubycritic for code quality score..."
rubycritic_output=$(bundle exec rubycritic app lib --no-browser | tee /dev/tty)
code_quality=$(echo "${rubycritic_output}" | grep Score | cut -d " " -f2)

# rake environment
echo "Running rake environment to get build time..."
start=`date +%s.%N`
bundle exec rake environment
end=`date +%s.%N`
diff=$(python -c "print(${end} - ${start})")
build_time=$(printf "%0.2f" ${diff})

# Results
echo "\nResults"
echo "Code coverage (simplecov): ${code_coverage}"
echo "Code quality score (rubycritic): ${code_quality}"
echo "Direct dependencies: ${direct_dependencies}"
echo "Indirect dependencies: ${indirect_dependencies}"
echo "Build time (seconds): ${build_time}"