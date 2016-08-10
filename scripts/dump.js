models = require(config.root + 'app/db'),
    myUserId = 100001;

var status = ['open', 'close', 'open and going close'];
var jobTypes = ['agency', 'freelancer'];
var Town = ['Mumbai', 'Delhi', 'Bangalore'];
var Introduction = ["I'm JS programmer", "I'm Java programmer", "I'm C++ programmer", "I'm C# programmer",]
var Description = ["Lorem ipsum dolor sit amet, consectetur adipisicing elit. Qui dicta minus molestiae vel beatae natus eveniet ratione temporibus aperiam harum alias officiis assumenda officia quibusdam deleniti eos cupiditate dolore doloribus!", "Ad dolore dignissimos asperiores dicta facere optio quod commodi nam tempore recusandae. Rerum sed nulla eum vero expedita ex delectus voluptates rem at neque quos facere sequi unde optio aliquam!", "Tenetur quod quidem in voluptatem corporis dolorum dicta sit pariatur porro quaerat autem ipsam odit quam beatae tempora quibusdam illum! Modi velit odio nam nulla unde amet odit pariatur at!", "Consequatur rerum amet fuga expedita sunt et tempora saepe? Iusto nihil explicabo perferendis quos provident delectus ducimus necessitatibus reiciendis optio tempora unde earum doloremque commodi laudantium ad nulla vel odio?"]
var Languages = ["English", "Hindi", "Tamil", "Telugu", "Kannada", "Malayalam", "Marathi", "Urdu", "Punjabi", "French", "German", "Spanish", "Japanese", "Chinese"]
var serviceProvider = ['Content Writing', 'Bloggers and Influencers', 'Marketing Planning', 'Media Buying', 'Creative and Ad making', 'Public Relations', 'Digital Marketing', 'Branding Services', 'Event Management', 'Direct Marketing'];
var date = new Date();
// function createTestUser() {
//     // myUserId
// }


function createUsers() {
    for (var i = 0; i < 500; i++) {
        models.User.create({
            email: 'test@test' + i + '.com',
            password: '123456',
            restore_code: i,
            first_name: "test" + i,
            last_name: "test" + i,
            phone: '8917100000' + i,
            company_name: "Absolute" + i,
            online: (i % 2 ? true : false),
            created_at: date
        });

    }
}

function getRandomCategory() {
    var a = Math.floor(Math.random() * serviceProvider.length)
    var arr = [];
    switch (a) {
        case 0:
            arr.push(serviceProvider[0])
            var b = Math.floor(Math.random() * 3);
            switch (b) {
                case 0:
                    arr.push('Content Type')
                    var c = Math.floor(Math.random() * 7);
                    var content = ['Blogs and Articles', 'Copywriting / Web Content', 'Technical Writing', 'Press Release Writing', 'Proof Reading', 'Books and Magazines', 'Translation'];
                    arr.push(content[c]);
                    break
                // switch (c) {
                //     case 0 :
                //         arr.push('Proof Reading');
                //         break;
                //     case 1 :
                //         arr.push('Blogs and Articles');
                //         break;
                //     case 2 :
                //         arr.push('Copywriting / Web Content');
                //         break;
                //     case 3 :
                //         arr.push('Technical Writing');
                //         break;
                //     case 4 :
                //         arr.push('Press Release Writing');
                //         break;
                //     case 5 :
                //         arr.push('Books and Magazines');
                //         break;
                //     case 6 :
                //         arr.push('Translation');
                //         break;
                // }
                case 1:
                    arr.push('Industry Expertise')
                    var z = Math.floor(Math.random() * 13);
                    var content1 = ['Health and Fitness', 'Business and Finance', 'Kids and Parenting', 'Sports', 'Travel & Tourism', 'Education', 'Technology', 'Science', 'Real Estate',
                        'Automotive', 'Food and Beverages', 'Media and Entertainment', 'Lifestyle'];
                    arr.push(content1[z]);
                    break;
                case 2:
                    arr.push('Languages');
                    var content2 = ['English', 'Hindi', 'Tamil', 'Telugu', 'Kannada', 'Malayalam', 'Marathi',
                        'Urdu', 'Punjabi', 'French', 'German', 'Spanish', 'Japanese', 'Chinese'];
                    var x = Math.floor(Math.random() * content2.length);
                    arr.push(content2[x])
                    break;
            }
            break;
        case 1:
            arr.push(serviceProvider[1])
            switch (getNumber(2)) {
                case 0 :

                    arr.push('Industry Expertise');
                    var industry = ['Health and Fitness', 'Business and Finance', 'Kids and Parenting', 'Sports', 'Travel and Tourism', 'Education',
                        'Technology', 'Science', 'Real Estate', 'Automotive', 'Food and Beverages', 'Lifestyle', 'Mobile and Gadgets',
                        'Fashion and Beauty', 'Cooking', 'Vernacular Language', 'Books and Reading'];
                    arr.push[industry[getNumber(industry.length)]];
                    break;

                case 1:
                    arr.push('Blog Type');
                    var blog = ['Web Blog', 'Video Blog', 'Social Influencer'];
                    arr.push(blog[getNumber(blog.length)])

                    break;

            }
            break;
        case 2:
            arr.push(serviceProvider[2]);
            var market = ['Media Planning', 'Rural Marketing Planning', 'Product Placement', 'Market Research', 'Loyalty Consulting'];
            arr.push(market[getNumber(market.length)]);
            break;
        case 3:
            arr.push(serviceProvider[3])
            var media = ['Cinema Media Buying', 'Magazine Media Buying', 'Digital Media Buying', 'Radio Media Buying', 'Television Media Buying',
                'Outdoor Media Buying', 'Non Traditional Media Buying', 'Newspaper Media Buying', 'Database Provider', 'In-Games Media Buying', 'Mobile and App Media Buying'];
            arr.push(media[getNumber(media.length)]);
            break;
        case 4:
            arr.push(serviceProvider[4]);
            var creative = ['Print Ads', 'Videos', 'Animated Videos', 'Cinema Ads', 'Music and Audio', 'Banner Ads', 'Cartoonist',
                'Photography', 'Presentation Design', 'Infographics'];
            arr.push(creative[getNumber(creative.length)])
            break
        case 5:
            arr.push(serviceProvider[5]);
            switch (getNumber(5)) {
                case 0:
                    arr.push('PR services')
                    var prService = ['Public Relations Strategy', 'Press Release', 'Media Interactions', 'Press Conference', 'Byline Placement',
                        'Crisis Communications', 'Blogger Outreach', 'Media Monitoring'];
                    arr.push(prService[getNumber(prService.length)]);
                    break;
                case 1:
                    arr.push('Industry Expertise');
                    var expertise = ['Startups', 'Lifestyle', 'Consumer Technology', 'B2B Technology', 'Celebrity', 'Retail and FMCG',
                        'Hospitality', 'Pharmaceuticals', 'Education', 'Healthcare', 'Construction and Real Estate',
                        'Banking and Finance', 'Politics', 'Industry Expertise'];
                    arr.push(expertise[getNumber(expertise.length)]);
                    break;
                case 2:
                    arr.push('Print');
                    arr.push(' ');
                    break
                case 3:
                    arr.push('Electronic');
                    arr.push(' ');
                    break;
                case 4:
                    arr.push('Digital');
                    arr.push(' ');
                    break
            }
            break
        case 6:
            arr.push(serviceProvider[6]);
            switch (getNumber(4)) {
                case 0:
                    arr.push('Digital Marketing');
                    var digital = ['Digital Marketing Planning', 'Social Media Management', 'SEO', 'Digital Advertising',
                        'Analytics', 'Online Reputation Management', 'Affiliate Marketing', 'Email Marketing'];
                    arr.push(digital[getNumber(digital.length)]);
                    break
                case 1:
                    arr.push('Branding Services');
                    var brandingServices = ['Brand Consulting', 'Brand Identity Design', 'Logo Design', 'Brochure Design', 'Merchandise Design', 'Web Design', 'Packaging Design', 'Business Cards'];
                    arr.push(brandingServices[getNumber(brandingServices.length)]);
                    break
                case 2:
                    arr.push('Event Management');
                    var eventManagement = ['Exhibition Management', 'Events Management', 'Celebrity Management', 'Emcee'];
                    arr.push(eventManagement[getNumber(eventManagement.length)]);
                    break
                case 3:
                    arr.push('Direct Marketing')
                    var direct = ['BTL Marketing', 'Retail POS', 'Telemarketing', 'Couponing / Sampling', 'Bulk SMS Service', 'Bulk Email Service', 'Promotional Merchandise'];
                    arr.push(direct[getNumber(direct.length)])
                    break
            }
            console.log('AASSASASASASASAS', arr)
    }
    console.log(arr, 'WOOOp')
    return arr;
}


function createJobs() {
    console.log('ZAWEL2')

    for (var i = 0; i < 100; i++) {
        var arr = getRandomCategory()

        models.Job.create({
            title: 'Test' + i,
            types: jobTypes[getNumber(2)],
            description: 'This is job' + i,
            local_preference: Town[getNumber(3)],
            content_types: serviceProvider[getNumber(10)],
            budget: i,
            mobile: '8918100000' + i,
            type_category: arr[0],//serviceProvider[getNumber(serviceProvider.length)],
            type_filter: arr[1],//' ',
            type_name: arr[2] || null,
            email: 'test' + i + '@test.com',
            client_name: 'Test' + i,
            company_name: 'google' + i,
            website: 'bestCiteInTheWorld' + i + '.com',
            job_visibility: (i % 2 ? true : false),
            date_of_completion: date,
            status: status[getNumber(3)],
            closed_date: date,
            // attach: [{
            //     type: Number,
            //     ref: 'Attachment'
            // }],
            // preview: {
            //     type: Number,
            //     ref: 'Attachment'
            // },
            // // info: {
            // //     name: String,
            // //     mobile: String,
            // //     email: String,
            // //     company_name: String,
            // //     website: String
            // // },
            // payment_basis: String,
            // admin_approved: {
            //     type: Number,
            //     default: 0
            // },
            // reject_reason: String,
            // user: {
            //     type: Number,
            //     ref: 'User'
            // },
            // buyer: {
            //     type: Number,
            //     ref: 'User'
            // },
            // contract: {
            //     type: Number,
            //     ref: 'Contract'
            // },
            // contracts: [{
            //     type: Number,
            //     ref: 'Contract'
            // }],
            created_at: date
        });

    }
}

function getNumber(number) {
    return Math.floor(Math.random() * number)
}


function createFreelances() {
    for (var i = 0; i < 100; i++) {
        models.Freelancer.create({
            name: 'Freelancer' + i,
            type: jobTypes[getNumber(2)],
            introduction: Introduction[getNumber(4)],
            description: Description[getNumber(4)],
            location: Town[getNumber(3)],
            cities: Town[getNumber(3)],
            experience: getNumber(16),
            service_providers: serviceProvider[getNumber(8)],
            languages: Languages[getNumber(Languages.length)],
            price: {
                word: getNumber(100),
                hour: getNumber(25)
            }
        })
    }

}

// function createMyJobs() {
//     // myUserId
// }


createUsers();
createJobs();
createFreelances();