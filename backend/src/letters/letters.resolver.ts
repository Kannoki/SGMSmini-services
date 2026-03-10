import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { LettersService } from './letters.service';
import { Letter } from './letter.model';
import { CreateLetterInput } from './dto/create-letter.input';
import { UpdateLetterInput } from './dto/update-letter.input';

@Resolver(() => Letter)
export class LettersResolver {
  constructor(private lettersService: LettersService) {}

  @Query(() => [Letter])
  letters() {
    return this.lettersService.findAll();
  }

  @Query(() => Letter, { nullable: true })
  letter(@Args('id', { type: () => ID }) id: string) {
    return this.lettersService.findOne(id);
  }

  @Mutation(() => Letter)
  createLetter(@Args('input') input: CreateLetterInput) {
    return this.lettersService.create(input);
  }

  @Mutation(() => Letter)
  updateLetter(
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: UpdateLetterInput,
  ) {
    return this.lettersService.update(id, input);
  }

  @Mutation(() => Boolean)
  async deleteLetter(@Args('id', { type: () => ID }) id: string) {
    await this.lettersService.remove(id);
    return true;
  }

  @Mutation(() => Letter)
  async sendLetterNow(
    @Args('letterId', { type: () => ID }) letterId: string,
    @Args('recipients', { type: () => [String], nullable: true }) recipients?: string[],
  ) {
    const result = await this.lettersService.sendNow(letterId, recipients);
    if (!result.success) throw new Error(result.error || 'Failed to send');
    return this.lettersService.findOne(letterId);
  }
}
