%% Check that system is Completelly observable
function ok = checkCO()
% Observability
[A B C] = modelization();  
% check CO
if (is_observable(A,C))
  printf("System is observable - OK\n");
  ok = true;
else
  printf("System is NOT observable !!! KO\n");
  of = false;
endif
end