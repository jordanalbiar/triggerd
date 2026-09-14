const fs = require('fs');
let code = fs.readFileSync('src/components/CommandManager.tsx', 'utf8');

// Find </form>
const formIdx = code.indexOf("</form>");
if (formIdx > -1) {
  // we need to move </form> and the </div> before it, OUTSIDE the step conditions.
  // Actually, let's look at the generated file.
  // It has:
  // 2728| 
  // 2729|                  </div>
  // 2730|                </form>
  // 2731| 
  // 2732|               
  // 2733|   </div>
  // 2734| )}
  // 2735| {triggerFormStep === 5 && (

  // We should extract:
  //                  </div>
  //                </form>
  // and move it to after the closing brace of triggerFormStep === 5
  
  code = code.replace(/\s*<\/div>\s*<\/form>\s*<\/div>\s*\)}\s*\{triggerFormStep === 5 && \(\s*<div className="space-y-4">/, `
  </div>
)}
{triggerFormStep === 5 && (
  <div className="space-y-4">`);
  
  // Now we need to append </div></form> AFTER step 5
  code = code.replace(/This command will add the overlay to your live stage when triggered in chat\.<\/p>\s*<\/div>\s*<\/div>\s*<\/div>\s*\)}/, `This command will add the overlay to your live stage when triggered in chat.</p>
      </div>
    </div>
  </div>
)}
                </div>
              </form>`);

  fs.writeFileSync('src/components/CommandManager.tsx', code);
  console.log("Fixed!");
}
