# Mainstreaming data innovation through the UNDP Accelerator Labs Network

![Areas x datasources x labs](/imgs/stats/data_and_applications_colors.png)
*Main data sources and application areas per lab*

- [Download the data](https://github.com/UNDP-Accelerator-Labs/AI-map/blob/main/data/acclab_data_innovation.csv)

Over the past four years, the [UNDP Accelerator Labs Network](https://www.undp.org/acceleratorlabs) has been pushing for the mainstreaming of data innovation in sustainable development practice. Here we take stock of these efforts and highlight a certain convergence between computaional techniques, datasources, and application areas. Note the work of the labs is action oriented. Other application areas and convergences undoubtably exist, typically in academic work. The purpose of this compliation is to highlight the application readiness of these techniques x datasources for specific development application areas around the world.

The focus is intentionally reductive. It is on data innovation "projects". It should be noted however, that these are all part of broader portfolios of interventions. Overall, the UNDP Accelerator Labs Network sees data innovation a means to an end, not as an objective in itself. 

The next frontier for many of these projects is to establish data collaboratives to ensure their sustainability. More to come on this soon…

## Descriptive analysis

<table>
	<thead>
		<tr>
			<th>Computational technique</th>
			<th>Main datasource</th>
			<th>Area</th>
			<th>Application</th>
			<th>Lab</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td rowspan=8>Feature detection</td>
			<td rowspan=2>Drone imagery</td>
			<td rowspan=2>Agriculture and pastoralism</td>
			<td rowspan=2>Crop disease detection</td>
			<td>Cameroon</td>
		</tr>
		<tr>
			<td>Cabo Verde</td>
		</tr>
		<tr>
			<td rowspan=6>Satellite imagery</td>
			<td rowspan=5>Pollution and waste management</td>
			<td rowspan=3>Dump site detection</td>
			<td>Guatemala</td>
		</tr>
		<tr>
			<td>Serbia</td>
		</tr>
		<tr>
			<td>Vietnam</td>
		</tr>
		<tr>
			<td>Plastic waste detection in river systems</td>
			<td>The Philippines</td>
		</tr>
		<tr>
			<td>Brick kiln detection</td>
			<td>India</td>
		</tr>
		<tr>
			<td>Environmental monitoring</td>
			<td>Mine detection</td>
			<td>Bolivia</td>
		</tr>
		<tr>
			<td rowspan=6>Land cover and use classification</td>
			<td rowspan=6>Satellite imagery</td>
			<td rowspan=4>Agriculture and pastoralism</td>
			<td>Detection of sustained grazing areas over time</td>
			<td>Somalia</td>
		</tr>
		<tr>
			<td>Detection of sustained dry croplands over time</td>
			<td>Niger</td>
		</tr>
		<tr>
			<td>Detection of forest boundaries over time</td>
			<td>Ecuador</td>
		</tr>
		<tr>
			<td>Multilayer map generation</td>
			<td><a href='https://github.com/undpindia/dicra' target='_blank'>India</a></td>
		</tr>
		<tr>
			<td rowspan=2>Disaster risk management</td>
			<td>Flood detection</td>
			<td>Mauritania</td>
		</tr>
		<tr>
			<td>Landslide detection</td>
			<td>Kyrgyzstan</td>
		</tr>
		<tr>
			<td rowspan=6>Topic analysis and classification</td>
			<td rowspan=3>Online reviews</td>
			<td rowspan=3>Tourism</td>
			<td>Topic analysis of toursit reviews</td>
			<td>Jordan</td>
		</tr>
		<tr>
			<td rowspan=2>Sentiment analysis of tourist reviews</td>
			<td>Malawi</td>
		</tr>
		<tr>
			<td>Tanzania</td>
		</tr>
		<tr>
			<td rowspan=3>Social media posts</td>
			<td rowspan=2>Gender</td>
			<td rowspan=2>Gender-related toxic speech detection</td>
			<td>Kyrgyzstan</td>
		</tr>
		<tr>
			<td>Uruguay</td>
		</tr>
		<tr>
			<td>Misinformation</td>
			<td></td>
			<td>Jordan</td>
		</tr>
		<tr>
			<td rowspan=5>Generative AI</td>
			<td rowspan=2>Pre-trained text model</td>
			<td>Operations support</td>
			<td>R script generation for simple, baseline data analyses and visualizations</td>
			<td>Guatemala</td>
		</tr>
		<tr>
			<td>Education</td>
			<td>Personalized ducational material generation</td>
			<td>Cameroon</td>
		</tr>
		<tr>
			<td>Pre-trained text model + political speeches</td>
			<td>Democratic governance</td>
			<td>Unified political speech generation</td>
			<td>Argentina</td>
		</tr>
		<tr>
			<td>Pre-trained image model</td>
			<td>Gender</td>
			<td>Analysis of gender stereotypes in STEM fields</td>
			<td>Serbia</td>
		</tr>
		<tr>
			<td>Pre-trained image model + urban and vegetation photos</td>
			<td>Urban development</td>
			<td>Green urbanism image generation during public consultations</td>
			<td>North Macedonia</td>
		</tr>
		<tr>
			<td>Causal analysis</td>
			<td>LinkedIn profiles</td>
			<td>Gender</td>
			<td>Gender inequality in the workplace</td>
			<td>Serbia</td>
		</tr>
	</tbody>
</table>

Note we do not cover initiatives like crowdmapping here, as these are covered by the collective intelligence work of the labs.

Remote sensing data, whether low quality satellite imagery of high resolution drone imagery, is the most commonly used data source in the Accelerator Labs Network. This is likely due in part to the relative simplicity of accessing imagery and the maturity of the computational techniques. 

We also see a trend in applicaion areas for this type of data. Agriculture and pastoralism, and pollution and waste management are most common across labs, often trying to detect features in the imagery, like the aggregation of solid waste or crop diseases, or for deriving labd cover and land use maps, and vegetation indices.

We also see a trend across several labs on the use of online posts, typically to travel sites, to understand sub-national toursim dynamics.

<!-- ![Computational technique distribution](/imgs/stats/technique.png)
*Distribution of computational techniques*

![Datasource distribution](/imgs/stats/datasources.png)
*Distribution of datasource distribution*

![Area distribution](/imgs/stats/area.png)
*Distribution of topic areas* -->